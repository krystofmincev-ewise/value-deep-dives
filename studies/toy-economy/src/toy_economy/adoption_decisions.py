"""One-step private forecasts, evaluated simultaneously against inherited rivals.

Firms know the current available technology and cash-financeable household
budget. They do not forecast the future wage-demand feedback, rival responses,
capital accumulation, or an equilibrium. Adoption has no installation cost in
this extension; usage fees are its explicit recurring private cost.
"""

from .adoption import (
    CONSUMERS,
    AdoptionDecision,
    AdoptionParameters,
    Pair,
    allocate_expenditure,
    labor_plan,
    quote_prices,
)


def _forecast(
    index: int,
    own_automation: float,
    inherited_automation: Pair,
    inherited_prices: Pair,
    capital: Pair,
    budget: float,
    p: AdoptionParameters,
    lagged_quantities: Pair,
) -> tuple[float, float, float]:
    stages = (
        own_automation if index == 0 else inherited_automation[0],
        own_automation if index == 1 else inherited_automation[1],
    )
    plans = (
        labor_plan(stages[0], p, lagged_quantity=lagged_quantities[0]),
        labor_plan(stages[1], p, lagged_quantity=lagged_quantities[1]),
    )
    quoted = quote_prices(inherited_prices, plans, stages, capital, p)
    # The rival's inherited price is fixed in this bounded forecast. Actual
    # simultaneous repricing and adoption can invalidate the private prediction.
    prices = (
        quoted[0] if index == 0 else inherited_prices[0],
        quoted[1] if index == 1 else inherited_prices[1],
    )
    capacities = (
        min(plans[0].labor_capacity, capital[0]),
        min(plans[1].labor_capacity, capital[1]),
    )
    revenue = allocate_expenditure(
        budget,
        prices,
        capacities,
        p.price_elasticity,
        automation_fractions=stages,
        ai_service_capacity=p.ai_service_capacity,
    )[index]
    quantity = revenue / prices[index]
    fees = p.ai_fee_per_task_hour * own_automation * quantity / 8
    operating_surplus = revenue - fees - plans[index].contracted_wages
    return operating_surplus, quantity, prices[index]


def choose_adoption(
    current: Pair,
    available: Pair,
    inherited_prices: Pair,
    capital: Pair,
    budget: float,
    p: AdoptionParameters,
    *,
    lagged_quantities: Pair = (40.0, 40.0),
) -> tuple[Pair, tuple[AdoptionDecision, AdoptionDecision]]:
    """Both firms choose before either choice changes the other's forecast.

    Availability persists. A rejected stage may be reconsidered next round;
    accepted task automation is irreversible. The comparison is operating
    surplus before employee bonuses and dividend allocation, not utility or
    shareholder value. A strict hurdle avoids adoption on numerical ties.
    """
    choices = []
    decisions = []
    for index, firm in enumerate(CONSUMERS):
        candidate = (
            available[index]
            if p.adoption_rule == "scheduled"
            else min(available[index], current[index] + p.adoption_step)
        )
        candidate = max(current[index], candidate)
        unchanged = _forecast(
            index, current[index], current, inherited_prices, capital, budget, p, lagged_quantities
        )
        changed = _forecast(
            index, candidate, current, inherited_prices, capital, budget, p, lagged_quantities
        )
        if p.adoption_rule == "scheduled":
            chosen, reason = candidate, "scheduled_stage"
        elif candidate <= current[index] + 1e-12:
            chosen, reason = current[index], "no_new_available_stage"
        elif changed[0] > unchanged[0] + p.adoption_hurdle + 1e-10:
            chosen, reason = candidate, "predicted_surplus_improves"
        else:
            chosen, reason = current[index], "predicted_surplus_not_higher"
        choices.append(chosen)
        decisions.append(
            AdoptionDecision(
                firm,
                p.adoption_rule,
                available[index],
                current[index],
                candidate,
                chosen,
                budget,
                unchanged[0],
                changed[0],
                unchanged[1],
                changed[1],
                unchanged[2],
                changed[2],
                reason,
            )
        )
    return (choices[0], choices[1]), (decisions[0], decisions[1])
