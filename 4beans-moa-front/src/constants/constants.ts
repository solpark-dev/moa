import { Party, PartyStatus, ServiceType, SubscriptionProduct, User, UserSubscription } from './types';

export const MOCK_USER: User = {
  id: 'user-001',
  email: '4beans@moa.com',
  nickname: '힙스터김',
  role: 'USER',
  avatar: 'https://picsum.photos/200/200'
};

export const SUBSCRIPTION_PRODUCTS: SubscriptionProduct[] = [
  {
    id: 'prod-1',
    name: 'Netflix',
    tier: '프리미엄',
    price: 17000,
    maxProfiles: 4,
    iconUrl: 'https://picsum.photos/id/1/50/50',
    description: '4K UHD 화질, 동시접속 4명, 모든 디바이스 지원',
    category: 'Video',
    billingCycle: 'Monthly',
    status: 'ACTIVE'
  },
  {
    id: 'prod-2',
    name: 'Wavve',
    tier: '스탠다드',
    price: 10900,
    maxProfiles: 2,
    iconUrl: 'https://picsum.photos/id/2/50/50',
    description: 'FHD 화질, 동시접속 2명, TV/모바일/PC 지원',
    category: 'Video',
    billingCycle: 'Monthly',
    status: 'ACTIVE'
  },
  {
    id: 'prod-3',
    name: 'Disney+',
    tier: '프리미엄',
    price: 9900,
    maxProfiles: 4,
    iconUrl: 'https://picsum.photos/id/3/50/50',
    description: '4K UHD & HDR, 동시접속 4명, IMAX Enhanced',
    category: 'Video',
    billingCycle: 'Monthly',
    status: 'INACTIVE' // Admin only
  },
  {
    id: 'prod-4',
    name: 'Youtube Premium',
    tier: '패밀리',
    price: 14900,
    maxProfiles: 5,
    iconUrl: 'https://picsum.photos/id/4/50/50',
    description: '광고 없는 영상, 백그라운드 재생, 유튜브 뮤직 포함',
    category: 'Video',
    billingCycle: 'Monthly',
    status: 'ACTIVE'
  },
  {
    id: 'prod-5',
    name: 'Spotify',
    tier: '듀오',
    price: 16350,
    maxProfiles: 2,
    iconUrl: 'https://picsum.photos/id/5/50/50',
    description: '광고 없는 음악 감상, 오프라인 저장, 나만의 플레이리스트',
    category: 'Music',
    billingCycle: 'Monthly',
    status: 'ACTIVE'
  },
];

export const MOCK_USER_SUBSCRIPTIONS: UserSubscription[] = [
  {
    id: 'sub-1',
    userId: 'user-001',
    productId: 'prod-1',
    product: SUBSCRIPTION_PRODUCTS[0],
    startDate: '2023-11-01',
    nextBillingDate: '2023-12-01',
    status: 'ACTIVE'
  }
];

export const MOCK_PARTIES: Party[] = [
  {
    id: 'party-1',
    serviceName: ServiceType.NETFLIX,
    title: '넷플릭스 4K 프리미엄 장기 팟 구해요',
    description: '1년 동안 끊김 없이 같이 보실 분 모집합니다. 매너 필수! 규칙 잘 지키시는 분만 오세요.',
    hostId: 'host-1',
    hostName: '영화광',
    pricePerMonth: 4250,
    maxMembers: 4,
    currentMembers: 3,
    status: PartyStatus.RECRUITING,
    startDate: '2023-10-01',
    nextBillingDate: '2023-11-01',
    category: 'Video'
  },
  {
    id: 'party-2',
    serviceName: ServiceType.DISNEY,
    title: '디즈니플러스 마블 정주행 팟 🦸‍♂️',
    description: '로키 시즌2 같이 달려요~! 먹튀 절대 사절입니다.',
    hostId: 'host-2',
    hostName: '마블팬',
    pricePerMonth: 2500,
    maxMembers: 4,
    currentMembers: 4,
    status: PartyStatus.FULL,
    startDate: '2023-09-15',
    nextBillingDate: '2023-10-15',
    category: 'Video'
  },
  {
    id: 'party-3',
    serviceName: ServiceType.YOUTUBE,
    title: '유튜브 프리미엄 (광고 없는 삶)',
    description: '가족 요금제 자리 하나 남았습니다. 입금 빠르신 분 환영해요.',
    hostId: 'host-3',
    hostName: '광고싫어',
    pricePerMonth: 3000,
    maxMembers: 5,
    currentMembers: 2,
    status: PartyStatus.RECRUITING,
    startDate: '2023-10-20',
    nextBillingDate: '2023-11-20',
    category: 'Video'
  },
  {
    id: 'party-4',
    serviceName: ServiceType.SPOTIFY,
    title: '스포티파이 패밀리 🎧',
    description: '출퇴근길 음악 필수이신 분들 모여라',
    hostId: 'host-4',
    hostName: 'DJ소다',
    pricePerMonth: 2300,
    maxMembers: 6,
    currentMembers: 4,
    status: PartyStatus.RECRUITING,
    startDate: '2023-10-25',
    nextBillingDate: '2023-11-25',
    category: 'Music'
  },
];