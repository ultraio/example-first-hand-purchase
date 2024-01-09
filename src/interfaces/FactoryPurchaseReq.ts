export interface FactoryPurchaseReq {
    id: number;
    price: string;
    purchase_limit?: number;
    purchased_tokens_no: number;
    promoter_basis_point: number;
    purchase_option_with_uniqs?: PurchaseOptionWithUniqs;
    sale_shares: any[];
    uos_payment: number;
    group_restriction: string;
    purchase_window_start?: string;
    purchase_window_end?: string;
}

export interface PurchaseOptionWithUniqs {
    transfer_tokens_receiver_account?: string;
    factories: SwappableFactoryConstraint[];
}

export interface SwappableFactoryConstraint {
    token_factory_id: number;
    count: number;
    strategy: number;
}
