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

    // custom value to cache the converted price from USD to UOS
    converted_price: string;
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

export interface OracleAverage {
    timestamp: number;
    price: string;
}

export interface OracleRollingMovingAverage {
    average: OracleAverage;
    is_valid_deprecated: number;
    param: number;
    moving_window_counter: number;
    unit: number;
}

export interface OracleFinalRate {
    rolling_moving_average: OracleRollingMovingAverage;
}