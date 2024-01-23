import { UltraAPI, connect } from '@ultraos/ultra-api-lib';
import { FactoryPurchaseReq, OracleFinalRate } from '../interfaces/FactoryPurchaseReq';

const networks = {
    // Main:
    a9c481dfbc7d9506dc7e87e9a137c931b0a9303f64fd7a1d08b8230133920097: 'https://ultra.api.eosnation.io',
    // Test Network:
    '7fc56be645bb76ab9d747b53089f132dcb7681db06f0852cfa03eaf6f7ac80e9': 'https://ultratest.api.eosnation.io',
};

const oracleConversionRateMarkup = 1.05; // increase the real converted UOS price by 5% to combat market fluctuations
let conversionRate;

export async function getApi(chain: string) {
    if (!networks[chain]) {
        alert(`Could not find API URL for Chain ID: ${chain}`);
        return;
    }

    const endpoint = networks[chain];
    return await connect(endpoint);
}

export async function getFactoryPurchase(api: UltraAPI, id: string | number): Promise<FactoryPurchaseReq[]> {
    return await api.contract('eosio.nft.ft').getTable<FactoryPurchaseReq>('fctrprchs.a', id);
}

export async function getConvertedPurchasePrice(api: UltraAPI, price: string) {
    if (price.endsWith('UOS')) return price;

    if (!conversionRate) {
        let entry = await api.contract('eosio.oracle').getTable<OracleFinalRate>('finalrates', 1);
        if (entry.length === 0) return null;
        let match = entry[0].rolling_moving_average.average.price.match(/[+-]?\d+(\.\d+)?/g);
        if (match.length === 0) return null;
        conversionRate = parseFloat(match[0]);
    }

    if (!price) return null;
    let priceFloat = parseFloat(price.match(/[+-]?\d+(\.\d+)?/g)[0]);
    let resultPrice = priceFloat / conversionRate;
    return resultPrice.toFixed(8) + ' UOS';
}