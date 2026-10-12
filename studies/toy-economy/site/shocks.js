'use strict';
const data = JSON.parse(document.getElementById('shock-data').textContent);
const choices = {
 replacement_abrupt_zero_jobs:['All jobs gone · investment follows sales','All ten paychecks end at period 5. Businesses adjust capital toward what recent sales support.'],
 fixed_abrupt_zero_jobs:['All jobs gone · investment stays at 20','Only employment changes. Fixed investment provides a continuing demand floor.'],
 replacement_gradual_fast_zero_jobs:['One job each period · investment follows sales','One paycheck ends in each period from 5 to 14; starting balances and eventual employment match the abrupt case.'],
 replacement_gradual_slow_zero_jobs:['One job every five periods · investment follows sales','One paycheck ends every five periods from 5 to 50. Slower change delays the final spending problem.'],
 replacement_zero_jobs_owner_spending_079:['All jobs gone · owners spend 79%','The unconstrained spending loop returns 99% each round. Decline is much slower, not eliminated.'],
 replacement_zero_jobs_owner_spending_080:['All jobs gone · owners spend 80%','Owner consumption and sales-responsive investment together support continued circulation in this run.'],
 zero_jobs_ownership_60:['All jobs gone · workers receive 60% of dividends','Ownership changes at the same time as employment. Worker income continues as capital distributions.'],
 freeze_5_recovery_current_wages:['Five-period investment pause · workers can move','Investment stops at 5 and restarts at 10. The wage bill is reallocated with current firm value added.'],
 freeze_5_failure_fixed_wage_shares:['Same pause · each firm keeps its payroll','Only payroll allocation changes. Capital-goods firms can fail even while aggregate income covers total wages.'],
 freeze_15_recovery_firm_cash_100:['Fifteen-period pause · survives at lower GDP','Starting firm cash is 100; equipment purchases stop at 5 and resume at 20.'],
 freeze_16_failure_firm_cash_100:['Sixteen-period investment pause · failed restart','Same starting accounts, but the intended restart is one period later. The run stops before that restart.'],
 freeze_17_abrupt_five_jobs_no_firm_cash:['Common investment freeze · five jobs cut immediately','Firm reserves start at zero. Investment freezes at 5 and resumes at 22; employment drops to five at 5.'],
 freeze_17_gradual_slow_five_jobs_no_firm_cash:['Same freeze · five jobs cut slowly','Same starting accounts and equipment schedule; one job ends every five periods. The run fails before reaching its planned endpoint.'],
 replacement_five_jobs_gamma_060:['Five jobs gone · firms adjust investment aggressively','60% capital-gap adjustment can create repeated peaks after floors and cash constraints bind.'],
 baseline:['No shock · baseline','The original circulation: GDP 100, consumption 80 and investment 20.']
};
const $ = id => document.getElementById(id);
const fmt = n => n !== 0 && Math.abs(n) < .01 ? n.toExponential(2) : n.toLocaleString('en-GB',{maximumFractionDigits:2});
for (const [key,[label]] of Object.entries(choices)) { const option = document.createElement('option'); option.value=key; option.textContent=label; $('shock-case').append(option); }
function renderChart(rows, selected) {
 const w=820,h=300,left=48,right=18,top=18,bottom=35;
 const last=Math.max(30,rows[rows.length-1].period), max=Math.max(110,...rows.map(r=>r.gdp));
 const x=t=>left+t/last*(w-left-right), y=v=>h-bottom-v/max*(h-top-bottom);
 const fields=[['gdp','#236654'],['consumption','#c78c37'],['worker_consumption','#678baa']];
 const lines=fields.map(([field,color])=>`<polyline fill="none" stroke="${color}" stroke-width="2.5" points="${rows.map(r=>`${x(r.period)},${y(r[field])}`).join(' ')}"/>`).join('');
 const ticks=[0,Math.round(last/2),last].map(t=>`<text x="${x(t)}" y="${h-10}" text-anchor="middle" font-size="12" fill="#58675f">${t}</text>`).join('');
 $('shock-chart').innerHTML=`<line x1="${left}" y1="${y(0)}" x2="${w-right}" y2="${y(0)}" stroke="#9caea5"/><text x="8" y="${y(0)}" font-size="12" fill="#58675f">0</text><text x="8" y="${y(100)}" font-size="12" fill="#58675f">100</text>${ticks}${lines}<line x1="${x(selected.period)}" x2="${x(selected.period)}" y1="${top}" y2="${h-bottom}" stroke="#58675f" stroke-dasharray="3 4"/>`;
}
function updatePeriod() {
 const record=data.paths[$('shock-case').value],rows=record.rows;
 const r=rows[Number($('period').value)]; $('period-label').textContent=r.period;
 for(const [id,field] of [['shock-gdp','gdp'],['shock-consumption','consumption'],['shock-workers','worker_consumption'],['shock-investment','investment']]) $(id).textContent=fmt(r[field]);
 $('period-detail').textContent=`${r.jobs} worker-equivalents employed. Owners consume ${fmt(r.owner_consumption)}. Capital remaining: ${fmt(r.capital)}. Contracted wages: ${fmt(r.wages)}; paid: ${fmt(r.wages_paid)}; arrears: ${fmt(r.arrears)}.`;
 const s=record.summary,failed=s.first_insolvency_period!==null;
 $('run-status').className=failed?'danger':'explanation';
 $('run-status').textContent=failed?`This run stops at period ${s.first_insolvency_period} with ${fmt(s.peak_wage_arrears)} unpaid wages. Later recovery is not simulated. Failing firms: ${s.terminal_firm_arrears.join(', ')}.`:`Completed ${s.completed_periods} periods without unpaid wages. Last-period GDP: ${fmt(s.terminal_nominal_gdp)}; worker consumption: ${fmt(s.terminal_worker_consumption)}. No unpaid wages does not mean households prosper.`;
 renderChart(rows,r);
}
function changeCase(){const key=$('shock-case').value,record=data.paths[key];$('case-description').textContent=choices[key][1];$('period').max=record.rows.length-1;$('period').value=Math.min(10,record.rows.length-1);$('case-inputs').textContent=JSON.stringify({initial_parameters:record.parameters,shocks:record.shocks},null,2);updatePeriod();}
function changeLimits(){const share=Number($('saving-share').value),r=data.limits[$('resource-cap').value][share];$('saving-label').textContent=share;$('limit-gdp').textContent=fmt(r.real_gdp);$('limit-consumption').textContent=fmt(r.real_consumption);$('limit-detail').textContent=`Capital: ${fmt(r.capital)}. Replacement investment: ${fmt(r.replacement_investment)}. ${r.resource_bound?'The physical output ceiling binds.':'The physical output ceiling does not bind.'} These are stationary real quantities, not the shock model's cash flows.`;}
$('shock-case').addEventListener('change',changeCase);$('period').addEventListener('input',updatePeriod);$('saving-share').addEventListener('input',changeLimits);$('resource-cap').addEventListener('change',changeLimits);changeCase();changeLimits();
