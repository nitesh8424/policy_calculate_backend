async function premium_calculation(data) {
    try {
        const ppt = Number(data.ppt);
        const pt = Number(data.pt);
        const policy_year = 20;
        // const policy_year = pt;
        const premium_frequency = data.premium_frequency;
        const input_sum_assured = Number(data.sum_assured);
        let premium = Number(data.modal_premium);
        if (premium_frequency === 'Monthly') {
            premium = premium * 12;
        } else if (premium_frequency === 'Half-Yearly') {
            premium = premium * 2;
        }

        // const bonusRates = [2.5, 3, 3.5, 3.5, 3.5, 3.5, 3, 3, 3, 3, 3, 2.5, 3, 3, 2.5, 5, 4, 4.5, 4, 25];
        const bonusRates = [2.5, 3, 3.5, 3.5, 3.5, 3.5, 3, 3, 3, 3, 3, 2.5, 3, 3, 2.5, 5, 4, 4.5, 4];

        let policyData = [];
        for (let index = 1; index <= policy_year; index++) {
            //for choose randomly yearly bonus rate (excluding 25)
            //as per insurance policy bonus rate vary every year.
            const bonus_rate = index===policy_year ? 25 : bonusRates[Math.floor(Math.random() * bonusRates.length)];
            // console.log(bonus_rate);

            //this is for check provided example
            // const bonus_rate = bonusRates[index - 1];
            const sum_assured = index === pt ? input_sum_assured : 0;
            const bonus_amount = (input_sum_assured * bonus_rate) / 100;

            policyData.push({
                policy_year: index,
                premium: index <= ppt ? premium : 0,
                sum_assured: index === pt ? sum_assured : 0,
                bonus_rates: bonus_rate,
                bonus_amount: bonus_amount,
                total_benefit: 0,
                net_cashflows: index <= ppt ? -(premium) : 0
            })
        }

        const benifit = policyData.reduce((total, item) => total + item.bonus_amount, 0) + input_sum_assured;
        const updatedPolicyData = policyData.map(obj => {
            if (obj.policy_year === pt) {
                return {
                    ...obj,
                    total_benefit: benifit,
                    net_cashflows: benifit
                };
            }
            return obj; // unchanged
        });

        if (benifit) {
            return updatedPolicyData;
        } else {
            return []
        }
    } catch (error) {
        return error
    }
}

module.exports = {
    premium_calculation
};