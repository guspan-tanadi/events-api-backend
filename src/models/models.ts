export interface Event {
  event_title: string;
  description: string;
  category: "MUSIC" | "SPORTS" | "EDUCATION" | "TECHNOLOGY";
  price: number;
  discounted_price: number;
  is_free: boolean;
  date: Date;
  time: Date;
  location: string;
  seat_quantity: number;
  image_url: string;
}

export interface Discount {
    event_id: number;
    discount_percentage: number;
    start_date: Date;
    end_date: Date;
}

export interface Auth {
  username: string;
  fullname: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

