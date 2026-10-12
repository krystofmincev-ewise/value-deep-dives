import unittest
from math import fsum

from toy_economy.bank import BankLedger


class BankLedgerTests(unittest.TestCase):
    def ledger(self) -> BankLedger:
        return BankLedger({"workers": 60.0, "owners": 40.0, "firms": 80.0}, reserves=200, equity=20)

    def test_opening_capital_is_funded_not_free_deposits(self) -> None:
        bank = self.ledger()
        self.assertEqual(bank.snapshot.deposits, 180)
        self.assertEqual(bank.snapshot.reserves, 200)
        self.assertEqual(bank.snapshot.equity, 20)
        with self.assertRaises(ArithmeticError):
            BankLedger({"town": 200.0}, reserves=200, equity=20)

    def test_origination_transfer_and_principal_have_distinct_money_effects(self) -> None:
        bank = self.ledger()
        loan = bank.originate(
            0, "firms", 10, maturity_period=3, rate_per_round=0, purpose="payroll"
        )
        self.assertEqual(bank.snapshot.loans, 10)
        self.assertEqual(bank.snapshot.deposits, 190)
        bank.transfer(0, "firms", "workers", 10, "wages")
        self.assertEqual(bank.snapshot.deposits, 190)
        bank.repay_principal(1, loan.loan_id, 10)
        self.assertEqual(bank.snapshot.loans, 0)
        self.assertEqual(bank.snapshot.deposits, 180)
        self.assertEqual(bank.snapshot.equity, 20)
        self.assertEqual(bank.snapshot.reserves, 200)

    def test_interest_income_and_profit_distribution(self) -> None:
        bank = self.ledger()
        bank.originate(0, "firms", 10, maturity_period=3, rate_per_round=0.01, purpose="payroll")
        bank.service_opening_debt(1, "firms", available_cash=10.1)
        self.assertAlmostEqual(bank.snapshot.deposits, 179.9)
        self.assertAlmostEqual(bank.snapshot.equity, 20.1)
        bank.distribute_profit(1, "owners", 0.1)
        self.assertAlmostEqual(bank.snapshot.deposits, 180)
        self.assertAlmostEqual(bank.snapshot.equity, 20)
        with self.assertRaises(ValueError):
            bank.distribute_profit(1, "owners", 1)

    def test_unpaid_interest_is_memo_not_hidden_money_or_asset(self) -> None:
        bank = self.ledger()
        bank.originate(0, "firms", 10, maturity_period=3, rate_per_round=0.03, purpose="payroll")
        before = bank.snapshot
        service = bank.service_opening_debt(1, "firms", available_cash=0)[0]
        self.assertEqual(bank.snapshot, before)
        self.assertAlmostEqual(bank.loans[0].unpaid_interest, 0.3)
        self.assertFalse(service.default)
        with self.assertRaises(ValueError):
            bank.service_opening_debt(1, "firms", available_cash=0)

    def test_zero_recovery_forgiveness_keeps_deposits_and_removes_liability(self) -> None:
        bank = self.ledger()
        bank.originate(
            0, "firms", 20, maturity_period=2, rate_per_round=0.01, purpose="forecast_error"
        )
        bank.transfer(0, "firms", "workers", 100, "wages")
        bank.service_opening_debt(1, "firms", available_cash=0)
        result = bank.service_opening_debt(2, "firms", available_cash=0)[0]
        self.assertTrue(result.default)
        self.assertEqual(result.principal_forgiven, 20)
        self.assertAlmostEqual(result.interest_forgiven, 0.4)
        self.assertEqual(bank.snapshot.deposits, 200)
        self.assertEqual(bank.snapshot.loans, 0)
        self.assertEqual(bank.snapshot.equity, 0)
        self.assertEqual(bank.loans[0].status, "forgiven")
        self.assertEqual(bank.loans[0].outstanding_principal, 0)
        self.assertEqual(bank.loans[0].unpaid_interest, 0)

    def test_new_credit_cannot_roll_old_principal_in_same_round(self) -> None:
        bank = BankLedger({"borrower": 0.0, "seller": 180.0}, reserves=200, equity=20)
        old = bank.originate(0, "borrower", 10, maturity_period=4, rate_per_round=0, purpose="old")
        bank.transfer(0, "borrower", "seller", 10, "goods")
        bank.originate(1, "borrower", 10, maturity_period=4, rate_per_round=0, purpose="new")
        with self.assertRaises(ValueError):
            bank.repay_principal(1, old.loan_id, 10)
        result = bank.service_opening_debt(1, "borrower", available_cash=10)
        self.assertEqual(result[0].principal_paid, 0)
        self.assertEqual(len(result), 1)
        self.assertEqual(bank.debt("borrower"), 20)

    def test_actual_spending_then_income_can_service_opening_debt(self) -> None:
        bank = BankLedger({"borrower": 0.0, "seller": 180.0}, reserves=200, equity=20)
        bank.originate(0, "borrower", 10, maturity_period=4, rate_per_round=0, purpose="old")
        bank.transfer(0, "borrower", "seller", 10, "goods")
        bank.originate(1, "borrower", 10, maturity_period=4, rate_per_round=0, purpose="new")
        bank.transfer(1, "borrower", "seller", 10, "goods")
        bank.transfer(1, "seller", "borrower", 5, "income")
        service = bank.service_opening_debt(1, "borrower", available_cash=5)
        self.assertEqual(service[0].principal_paid, 5)
        self.assertEqual(bank.debt("borrower"), 15)

    def test_service_charges_simple_interest_for_elapsed_rounds(self) -> None:
        bank = self.ledger()
        bank.originate(0, "firms", 10, maturity_period=4, rate_per_round=0.01, purpose="bridge")
        service = bank.service_opening_debt(3, "firms", available_cash=0)[0]
        self.assertAlmostEqual(service.interest_accrued, 0.3)
        self.assertEqual(bank.snapshot.loans, 10)

    def test_partial_service_and_every_event_balance(self) -> None:
        bank = self.ledger()
        bank.originate(0, "firms", 10, maturity_period=2, rate_per_round=0.1, purpose="bridge")
        bank.service_opening_debt(1, "firms", available_cash=0.5)
        bank.service_opening_debt(2, "firms", available_cash=2)
        for event in bank.events:
            self.assertAlmostEqual(event.snapshot.balance_sheet_error, 0)
        loan = bank.loans[0]
        self.assertAlmostEqual(
            loan.original_principal, loan.principal_repaid + loan.principal_forgiven
        )
        self.assertAlmostEqual(fsum(bank.balances.values()), bank.snapshot.deposits)

    def test_forgiveness_rejects_backdating_and_premature_default_without_mutation(self) -> None:
        bank = self.ledger()
        loan = bank.originate(5, "firms", 10, maturity_period=7, rate_per_round=0, purpose="bridge")
        before = (bank.snapshot, bank.loans, bank.events)
        for period in (4, 5, 6):
            with self.subTest(period=period), self.assertRaises(ValueError):
                bank.forgive(period, loan.loan_id)
            self.assertEqual((bank.snapshot, bank.loans, bank.events), before)
        bank.forgive(7, loan.loan_id)
        self.assertEqual(bank.snapshot.equity, 10)
        self.assertEqual(bank.loans[0].status, "forgiven")

    def test_forgiveness_rejects_closed_or_already_settled_loans(self) -> None:
        for resolution in ("repaid", "forgiven", "principal_paid_directly"):
            with self.subTest(resolution=resolution):
                bank = self.ledger()
                loan = bank.originate(
                    0, "firms", 10, maturity_period=2, rate_per_round=0, purpose="bridge"
                )
                if resolution == "repaid":
                    bank.service_opening_debt(1, "firms", available_cash=10)
                elif resolution == "forgiven":
                    bank.forgive(2, loan.loan_id)
                else:
                    bank.repay_principal(1, loan.loan_id, 10)
                before = (bank.snapshot, bank.loans, bank.events)
                with self.assertRaises(ValueError):
                    bank.forgive(2, loan.loan_id)
                self.assertEqual((bank.snapshot, bank.loans, bank.events), before)

    def test_transactions_are_chronological_but_failed_future_call_does_not_advance_time(
        self,
    ) -> None:
        bank = self.ledger()
        bank.transfer(5, "workers", "owners", 1, "income")
        before = (bank.snapshot, bank.balances, bank.events)
        with self.assertRaises(ValueError):
            bank.transfer(4, "workers", "owners", 1, "backdated")
        self.assertEqual((bank.snapshot, bank.balances, bank.events), before)
        with self.assertRaises(ValueError):
            bank.transfer(10, "workers", "owners", 1000, "invalid_future_payment")
        bank.transfer(5, "workers", "owners", 1, "same_round_valid_payment")
        self.assertEqual(bank.balance("workers"), 58)

    def test_principal_repayment_cannot_evade_current_round_interest(self) -> None:
        bank = self.ledger()
        loan = bank.originate(
            0, "firms", 10, maturity_period=2, rate_per_round=0.1, purpose="bridge"
        )
        before = (bank.snapshot, bank.loans, bank.events)
        with self.assertRaises(ValueError):
            bank.repay_principal(1, loan.loan_id, 10)
        self.assertEqual((bank.snapshot, bank.loans, bank.events), before)
        service = bank.service_opening_debt(1, "firms", available_cash=11)[0]
        self.assertEqual(service.interest_accrued, 1)
        self.assertEqual(service.interest_paid, 1)
        self.assertEqual(service.principal_paid, 10)
        self.assertEqual(bank.loans[0].status, "repaid")

    def test_direct_forgiveness_cannot_hide_unaccrued_interest(self) -> None:
        bank = self.ledger()
        loan = bank.originate(
            0, "firms", 10, maturity_period=2, rate_per_round=0.1, purpose="bridge"
        )
        before = (bank.snapshot, bank.loans, bank.events)
        with self.assertRaises(ValueError):
            bank.forgive(2, loan.loan_id)
        self.assertEqual((bank.snapshot, bank.loans, bank.events), before)
        service = bank.service_opening_debt(2, "firms", available_cash=0)[0]
        self.assertTrue(service.default)
        self.assertEqual(service.principal_forgiven, 10)
        self.assertEqual(service.interest_forgiven, 2)
        self.assertEqual(bank.loans[0].interest_forgiven, 2)

    def test_invalid_inputs_and_overdrafts(self) -> None:
        bank = self.ledger()
        for amount in (-1, float("nan"), float("inf")):
            with self.subTest(amount=amount), self.assertRaises(ValueError):
                bank.originate(0, "firms", amount, maturity_period=3, rate_per_round=0, purpose="x")
        with self.assertRaises(ValueError):
            bank.originate(0, "firms", 1, maturity_period=0, rate_per_round=0, purpose="x")
        with self.assertRaises(ValueError):
            bank.transfer(0, "workers", "owners", 61, "overdraft")
        with self.assertRaises(ValueError):
            bank.distribute_profit(0, "owners", 1)
        loan = bank.originate(0, "firms", 1, maturity_period=2, rate_per_round=0, purpose="x")
        with self.assertRaises(ValueError):
            bank.repay_principal(0, loan.loan_id, 1)
