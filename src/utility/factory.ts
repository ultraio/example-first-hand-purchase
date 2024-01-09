import { UltraAPI, connect } from '@ultraos/ultra-api-lib';
import { FactoryPurchaseReq } from '../interfaces/FactoryPurchaseReq';

const networks = {
    // Main:
    a9c481dfbc7d9506dc7e87e9a137c931b0a9303f64fd7a1d08b8230133920097: 'https://ultra.api.eosnation.io',
    // Test Network:
    '7fc56be645bb76ab9d747b53089f132dcb7681db06f0852cfa03eaf6f7ac80e9': 'https://ultratest.api.eosnation.io',
};

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
