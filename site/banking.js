'use strict';

// Only recorded Python results enter this view. Arithmetic below formats charts.
const bankingData = JSON.parse(document.getElementById('bank-data').textContent).cases;
const element = id => document.getElementById(id);
const format = value => Math.abs(value) < 1e-8 ? '0' : value.toLocaleString('en-GB', {maximumFractionDigits: 2});
const write = (id, value) => { element(id).textContent = value; };
const signed = (value, sign) => Math.abs(value) < 1e-8 ? '0' : `${sign}${format(value)}`;

function describeOutcome(summary) {
  const end = `Last simulated round: ${summary.last_completed_period}.`;
  if (summary.stop_reason === 'bank_insolvent') return `${end} Loan losses exceed bank capital. The bank is insolvent; later activity is not simulated. Remaining principal: ${format(summary.terminal_outstanding_principal)}, unpaid interest: ${format(summary.terminal_unpaid_interest)}.`;
  if (summary.stop_reason === 'bank_capital_depleted') return `${end} Loan losses exhaust bank capital. The model stops at this boundary; it does not invent a recapitalization or a deposit haircut.`;
  if (summary.stop_reason === 'wage_arrears') return `${end} Payroll is short by ${format(summary.wage_arrears)}. The model stops here. Outstanding principal ${format(summary.terminal_outstanding_principal)} and unpaid interest ${format(summary.terminal_unpaid_interest)} remain unresolved.`;
  if (summary.outcome === 'fully_repaid') return `${end} All ${format(summary.total_principal_advanced)} borrowed was repaid, plus ${format(summary.total_interest_paid)} in interest. No loan was forgiven. Inspect the path too: repayment can reduce later household purchases.`;
  if (summary.outcome === 'credit_unused') return `${end} No borrowing was needed. Merely adding a bank does not change production.`;
  if (summary.outcome === 'credit_refused') return `${end} No credit was advanced. Check the request decisions: disabled credit and lack of credible future income are different reasons.`;
  return `${end} Principal still outstanding: ${format(summary.terminal_outstanding_principal)}. Interest still owed: ${format(summary.terminal_unpaid_interest)}. Forgiven principal: ${format(summary.total_principal_forgiven)}. An unfinished loan is not counted as a successful repayment.`;
}

function drawChart(target, rows, selected, series) {
  const width = 820, height = 285, left = 90, right = 24, top = 26, bottom = 44;
  const values = rows.flatMap(row => series.map(([key]) => row[key]));
  const low = Math.min(0, ...values), high = Math.max(1, ...values);
  const span = high - low, last = Math.max(1, rows.at(-1).period);
  const x = period => left + period / last * (width - left - right);
  const y = value => height - bottom - (value - low) / span * (height - top - bottom);
  const lines = series.map(([key, color]) => `<polyline fill="none" stroke="${color}" stroke-width="3" points="${rows.map(row => `${x(row.period)},${y(row[key])}`).join(' ')}"/>`).join('');
  const labels = [low, high].map(value => `<text x="6" y="${y(value) + 4}" font-size="28" fill="#58675f">${format(value)}</text>`).join('');
  const ticks = [0, Math.round(last / 2), last].map(period => `<text x="${x(period)}" y="${height - 8}" text-anchor="middle" font-size="28" fill="#58675f">${period}</text>`).join('');
  element(target).innerHTML = `<line x1="${left}" x2="${width-right}" y1="${y(0)}" y2="${y(0)}" stroke="#9caea5"/>${labels}${ticks}${lines}<line x1="${x(selected.period)}" x2="${x(selected.period)}" y1="${top}" y2="${height-bottom}" stroke="#58675f" stroke-dasharray="4 4"/>`;
}

function tableRows(target, rows) {
  const body = element(target);
  body.replaceChildren();
  for (const values of rows) {
    const row = document.createElement('tr');
    for (const value of values) {
      const cell = document.createElement('td');
      cell.textContent = String(value);
      row.append(cell);
    }
    body.append(row);
  }
}

function updateRound() {
  const record = bankingData[element('bank-case').value];
  const index = Number(element('bank-period').value), row = record.rows[index];
  write('period-label', row.period);
  for (const [id, key] of [['gdp-value','gdp'],['worker-value','worker_consumption'],['owner-value','owner_consumption'],['investment-value','investment'],['opening-deposits','opening_deposits'],['closing-deposits','deposits'],['principal-value','principal'],['unpaid-interest-value','unpaid_interest'],['equity-value','equity'],['loss-value','forgiven']]) write(id, format(row[key]));
  for (const [id,key,sign] of [['new-credit','new_credit','+'],['principal-repaid','principal_repaid','−'],['interest-paid','interest_paid','−'],['bank-dividend','bank_dividend','+']]) write(id, signed(row[key], sign));
  write('round-explanation', `In round ${row.period}, workers receive ${format(row.wages_paid)} in wages; ${format(row.wage_arrears)} remains unpaid. Loans advanced: ${format(row.new_credit)}. Purchases happen before payroll in this model, so newly paid wages can support next round’s purchases. Loan receipt itself is not GDP.`);
  drawChart('output-chart', record.rows, row, [['gdp','#223c36'],['worker_consumption','#236654']]);
  drawChart('credit-chart', record.rows, row, [['principal','#75608c'],['equity','#a66d13']]);
  const bank = row.closing_bank;
  write('balance-check', `Bank assets: base cash ${format(bank.reserves)} + loan principal ${format(bank.loans)}. Liabilities and equity: deposits ${format(bank.deposits)} + bank capital ${format(bank.equity)}. Unpaid interest ${format(row.unpaid_interest)} is a separate contractual memo under the model’s cash-interest accounting.`);
  tableRows('account-rows', Object.keys(row.closing_balances).map(account => [account.replaceAll('_', ' '), format(row.opening_balances[account]), format(row.closing_balances[account])]));
  tableRows('decision-rows', row.decisions.length ? row.decisions.map(d => [d.borrower.replaceAll('_',' '),format(d.requested),format(d.advanced),d.refusal ? d.refusal.replaceAll('_',' ') : 'Approved']) : [['No requests this round','—','—','—']]);
  tableRows('loan-rows', row.loans.length ? row.loans.map(loan => [`${loan.borrower.replaceAll('_',' ')} / ${loan.loan_id}`, format(loan.outstanding_principal),format(loan.unpaid_interest),loan.maturity_period,loan.status]) : [['No loans','—','—','—','—']]);
  element('previous-round').disabled = index === 0;
  element('next-round').disabled = index === record.rows.length - 1;
}

function changeCase() {
  const record = bankingData[element('bank-case').value];
  write('case-description', record.description);
  write('case-outcome', describeOutcome(record.summary));
  element('case-outcome').className = record.summary.stop_reason ? 'danger' : 'explanation';
  element('bank-period').max = record.rows.length - 1;
  element('bank-period').value = Math.min(7, record.rows.length - 1);
  write('case-inputs', JSON.stringify(record.inputs, null, 2));
  updateRound();
}

function moveRound(direction) {
  const slider = element('bank-period');
  slider.value = Math.max(0, Math.min(Number(slider.max), Number(slider.value) + direction));
  updateRound();
}

element('bank-case').addEventListener('change', changeCase);
element('bank-period').addEventListener('input', updateRound);
element('previous-round').addEventListener('click', () => moveRound(-1));
element('next-round').addEventListener('click', () => moveRound(1));
changeCase();
