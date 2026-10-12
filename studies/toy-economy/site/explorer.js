'use strict';
// Only selects Python-generated records; there is no second economic model here.
const payload = JSON.parse(document.getElementById('model-data').textContent);
const fields = ['layoffs', 'price', 'investment', 'owner-spending', 'transfer'];
const number = value => value.toLocaleString('en-GB', {maximumFractionDigits: 2});
function update() {
  const values = fields.map(id => document.getElementById(id).value);
  const result = payload.rows[values.join('|')];
  const a = result.accounts;
  const empty = a === null;
  const price = Number(values[1]);
  const metrics = {'nominal': a?.nominal_gdp, 'real': a?.real_gdp,
    'workers': empty ? null : a.worker_consumption / price,
    'owners': empty ? null : a.owner_consumption / price};
  for (const [id, value] of Object.entries(metrics)) {
    document.getElementById(id).textContent = value == null ? '—' : number(value);
  }
  const labels = {'equilibrium':'Spending and production balance', 'capacity_rationed':'Production capacity binds',
    'indeterminate':'These rules do not determine the size of GDP',
    'no_stationary_equilibrium':'No stationary spending equilibrium',
    'infeasible_income':'This income allocation is not financeable'};
  document.getElementById('status').textContent = labels[result.status];
  document.getElementById('explanation').textContent = result.explanation;
  const pieces = empty ? [0, 0, 0] : [a.worker_consumption, a.owner_consumption, a.investment];
  ['worker-bar', 'owner-bar', 'investment-bar'].forEach((id, index) => {
    document.getElementById(id).style.width = `${!empty && a.nominal_gdp > 0 ? pieces[index] / a.nominal_gdp * 100 : 0}%`;
  });
  document.getElementById('identity').textContent = empty ? 'No unique feasible allocation is displayed.' :
    `GDP ${number(a.nominal_gdp)} = worker consumption ${number(a.worker_consumption)} + owner consumption ${number(a.owner_consumption)} + investment ${number(a.investment)}. Wage income: ${number(a.wages)}. Gross owner surplus before transfers: ${number(a.gross_surplus)}.`;
  document.getElementById('capacity-note').textContent = empty ? '' :
    `Capacity used: ${number(a.capacity_utilization * 100)}%. Unfilled consumption orders: ${number(a.unfilled_consumption)}; unfilled investment orders: ${number(a.unfilled_investment)}. All spending here is in money units.`;
}
for (const id of fields) document.getElementById(id).addEventListener('change', update);
const presets = {
  baseline:['0','1','20','0.5','0'],
  layoffs:['10','1','20','0.5','0'],
  prices:['0','0.5','20','0.5','0'],
  transfer:['10','1','20','0.5','60'],
  investment:['10','1','50','0.5','0'],
  circulate:['10','1','0','1','0']
};
for (const button of document.querySelectorAll('[data-preset]')) {
  button.addEventListener('click', () => {
    presets[button.dataset.preset].forEach((value, index) => document.getElementById(fields[index]).value = value);
    update();
  });
}
update();
