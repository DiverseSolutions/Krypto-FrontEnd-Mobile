import BigNumber from 'bignumber.js';


export function formatNumber(amount: number, decimal: number) {
    return new BigNumber(new BigNumber(amount).toFixed(decimal)).toFormat(decimal)
}