interface Latest {
    meta: Meta,
    data: LatestData[]
}

interface LatestData {
    id: number,
    slug: string,
    is_coin: boolean,
    is_token: boolean,
    rank: number,
    iconUrl: string,
    chart7d: string,
    name: string,
    symbol: string,
    volume_24h: number,
    max_supply: number,
    circulating_supply: number,
    quote: Quote,
    tags: Array<string>,
    buy_link: string
}

interface Search {
    crypto_top_search_ranks: Array<{
        id: number,
        name: string,
        symbol: string,
        slug: string,
        icon: string
    }>,
    sources: {
        cryptos_path: string,
        exchanges_path: string
    }
}

interface SearchResult {
    fields: Array<string>,
    icons: Array<{
        light: string,
        dark: string
    }>,
    values: Array<number | string>,
    timestamp: string
}

interface FearAndGreed {
    fgi: {
        now: {
            value: number,
            valueText: string
        },
        previousClose: {
            value: number,
            valueText: string
        },
        oneWeekAgo: {
            value: number,
            valueText: string
        },
        oneMonthAgo: {
            value: number,
            valueText: string
        },
        oneYearAgo: {
            value: number,
            valueText: string
        }
    }
}
interface LatestNews {
    meta: {
        error_code: number,
        error_message: string,
        size: number
    },
    data: Array<{
        slug: string,
        title: string,
        author: {
            first_name: string,
            last_name: string
        },
        description: string,
        read_time: string,
        updated_at: string,
        image_url: string,
        tag: {
            name: string,
            tag: string
        },
        link: string,
    }>
}

interface NewsSearch {
    title: string,
    slug: string,
    description: string,
    read_time: string,
    author: Array<{
        first_name: string,
        last_name: string,
        description: string,
        profile_image_url: string,
        social_link: {
            twitter: string,
            facebook: string,
            instagram: string,
            youtube: string,
        },
    }>,
    image_url: string,
    updated_at: string,
    tags: Array<{
        name: string,
        tag: string
    }>
}

interface News {
    meta: {
        error_code: number,
        error_message: string,
    },
    data: Array<{
        title: string,
        slug: string,
        description: string,
        read_time: string,
        author: Array<{
            first_name: string,
            last_name: string,
            description: string,
            profile_image_url: string,
            social_link: {
                twitter: string,
                facebook: string,
                instagram: string,
                youtube: string
            }
        }>,
        body: string,
        image_url: string,
        updated_at: string,
        created_at: string,
        tags: Array<{
            name: string,
            tag: string
        }>,
    }>
}
interface Card {
    meta: Meta,
    data: CardData[]
}

interface CardData {
    id: number,
    iconUrl: string,
    name: string,
    symbol: string,
    quote: Quote,
    slug: string,
    tags: Array<string>
}

interface AdAssetLatest {
    [key: string]: {
        [key: string]: Array<{
            ad_rank: number,
            title: string,
            description: string,
            banner: string,
            cta_link: string,
            cta_text: string,
            publisher: {
                name: string,
                icon: string
            },
            category: {
                name: string,
                slug: string
            },
            is_sponsored: boolean
        }>
    }
}

interface SingleData {
    id: number,
    slug: string,
    is_coin: boolean,
    is_token: boolean,
    rank: number,
    iconUrl: string,
    chart7d: string,
    name: string,
    symbol: string,
    volume_24h: number,
    max_supply: number,
    circulating_supply: number,
    quote: {
        [key: string]: Quote
    },
    tags: Array<string>
}

interface InfoData {
    id: number,
    symbol: string,
    name: string,
    description_content: string,
    blockchain_explorers: BlockchainExplorers[],
    wallets: Wallets[],
    community: Community[],
    contracts: Contracts[],
    whitepaper_link: string?,
    website_link: string?,
    website_name: string?,
    whitepaper_name: string?,
    tags: TagData[]
}

interface SingleExchange {
    id: number,
    name: string,
    slug: string,
    volume_24h: number,
    volume_24h_quotes: {
        [key: string]: string
    },
    num_market_pairs: number,
    fiats: Array<string>,
    market_pairs: Array<{
        rank: number,
        is_stale: boolean,
        name: string,
        logo?: string,
        slug: string,
        symbol: string,
        market_pair: string,
        trading_link: string,
        quote: {
            [key: string]: {
                price: number,
                volume_24h: number,
                updated_at: number
            }
        }
    }>
}

interface Markets {
    meta: Meta,
    data: {
        id: number,
        name: string,
        symbol: string,
        slug: string,
        num_market_pairs: number,
        market_pairs: Array<{
            rank: number,
            is_stale: boolean,
            exchange: {
                id: number,
                name: string,
                slug: string,
                logo: string,
                trust_score: number,
                trading_link: string,
                website_link: string
            },
            quote: {
                [key: string]: {
                    price: number,
                    updated_at: number,
                    visible_decimals: number,
                    volume: number
                }
            },
            url: string,
            market_pair: string,
            quote: MarketQuote,
        }>
    }
}

interface Exchanges {
    meta: {
        error_code: number,
        error_message: string
    },
    data: Array<{
        id: number,
        rank: number,
        logo: string,
        logo_dark: string,
        name: string,
        slug: string,
        num_coins: number,
        num_market_pairs: number,
        chart_7d: string,
        fiats: Array<string>,
        quote: {
            volume_24h: number
        },
        urls: {
            website: Array<string>,
        }
    }>
}

interface ExchangeInfo {
    id: number,
    name: string,
    slug: string,
    logo: string,
    urls: any,
    num_market_pairs: number,
    num_coins: number,
    spot_volume_mnt: number,
    spot_volume_quotes: {
        [key: string]: number
    },
    spot_volume_total_mnt: number,
    spot_volume_total_quotes: {
        [key: string]: number
    },
    spot_volume_updated_at: number
}


interface Metrics {
    meta: Meta,
    data: MetricsData
}

interface Methodology {
    title: string,
    content: string,
    created_at: number,
    updated_at: number
}

interface MetricsData {
    total_exchanges: number,
    quote: {
        [key: string]: {
            total_market_cap: number,
            total_volume_24h: number,
            local_market_cap: number
        }
    },
    active_cryptocurrencies: number
}

interface ArticleCategories {
    id: number, 
    name: string,
    slug: string,
    created_at: string,
    updated_at: string
}

interface Article {
    id: number,
    title: string,
    content: string,
    section_id: number,
    slug: string,
    created_at: string,
    updated_at: string
}

interface Markets {
    meta: Meta,
    data: MarketsData
}

interface MarketsData {
    id: number,
    name: string,
    symbol: string,
    slug: string,
    num_market_pairs: number,
    market_pairs: MarketPairs[]
}

interface MarketPairs {
    rank: number,
    exchange: Exchange,
    url: string,
    market_pair: string,
    quote: MarketQuote,
}

interface Exchange {
    id: number,
    name: string,
    slug: string,
    trust_score: number,
    trading_link: string,
    website_link: string
}

interface MarketQuote {
    price: number,
    volume: number,
    visible_decimals: number,
    updated_at: number
}

interface TagData {
    id: number,
    name: string,
    tag: string
}

interface NewsTag {
    [key: string]: {
        id: number,
        name: string,
        slug: string,
        image_url: string,
        description: string
    }
}

interface BlockchainExplorers {
    id: number,
    name: string,
    website_url: string
}

interface Wallets {
    id: number,
    name: string
}

interface Community {
    id: number,
    name: string
}

interface Contracts {
    id: number,
    contract_address: string,
    is_main: boolean,
    scan_url: string
}

interface Tag {
    meta: Meta,
    data: TagBody[]
}

interface TagBody {
    id: number,
    name: string,
    tag: string,
    is_popular?: bool
}

interface Quote {
    price: number,
    volume_24h: number,
    percent_change_24h: number,
    percent_change_7d: number,
    high_24h: number,
    low_24h: number,
    visible_decimals: number,
    market_cap: number,
    fully_diluted_market_cap: number
}

interface Meta {
    error_code: number,
    error_message: any,
    size: number,
}

interface SinglePageConversion {
    cryptos: Conversion[],
    fiats: Conversion[],
    trending?: Conversions[],
    foreign: Conversions[],
    rates?: Array<any>
}

interface Banner {
    id: number,
    created_at: string,
    updated_at: string,
    desktop_img: string,
    mobile_img: string,
    name: string,
    description?: string,
    sponsored_link: string,
    is_prod: boolean,
    is_mobile: boolean,
    is_img: boolean,
    youtube_link?: string,
    youtube_embed_link?: string,
}

interface Conversion {
    id: number?,
    logo: string?,
    symbol: string,
    rate: number,
    name: string,
}

interface AlertConfig {
    position?: any,
    icon: any,
    title: string,
    showConfirmButton?: boolean,
    timer?: number
}

interface ProfileInfo {
    avatarUrl: string,
    displayName: string,
    email: string,
    username: string,
    usernameUpdateIntervalDays: number,
    usernameUpdatedAt: string
}