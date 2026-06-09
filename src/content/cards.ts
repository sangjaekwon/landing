export type CardData = {
  id: string;
  name: string;
  priceRange: string;
  imageUrl: string;
};

const CDN = 'https://images.pokemontcg.io';

export const galleryCards: CardData[] = [
  { id: 'sv3pt5/199', name: '리자몽 ex SAR',    priceRange: '₩45,000~62,000', imageUrl: `${CDN}/sv3pt5/199_hires.png` },
  { id: 'sv3/125',    name: '리자몽 ex (테라)',   priceRange: '₩30,000~45,000', imageUrl: `${CDN}/sv3/125_hires.png`    },
  { id: 'sv3pt5/205', name: '뮤 ex HR',          priceRange: '₩28,000~40,000', imageUrl: `${CDN}/sv3pt5/205_hires.png` },
  { id: 'sv3pt5/6',   name: '리자몽 ex',         priceRange: '₩15,000~25,000', imageUrl: `${CDN}/sv3pt5/6_hires.png`   },
  { id: 'sv3pt5/151', name: '뮤 ex',             priceRange: '₩8,000~15,000',  imageUrl: `${CDN}/sv3pt5/151_hires.png` },
  { id: 'sv3pt5/150', name: '뮤츠',              priceRange: '₩6,000~12,000',  imageUrl: `${CDN}/sv3pt5/150_hires.png` },
  { id: 'sv3pt5/133', name: '이브이',             priceRange: '₩5,000~9,000',   imageUrl: `${CDN}/sv3pt5/133_hires.png` },
  { id: 'sv3pt5/25',  name: '피카츄',             priceRange: '₩3,000~6,000',   imageUrl: `${CDN}/sv3pt5/25_hires.png`  },
];
