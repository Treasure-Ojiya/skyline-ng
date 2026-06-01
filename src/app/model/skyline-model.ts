export class RegistrationModel {
  constructor(
    public name: string,
    public mobileNo: string,
    public email: string,
    public city: string,
    public address: string,
    public password: string,
  ) {}
}

export class LoginModel {
  constructor(
    public email = '',
    public password = '',
  ) {}
}

export class AddAirportModel {
  constructor(
    public airportId: number,
    public airportCode: string,
    public airportName: string,
    public cityId: number,
    public cityName: string,
  ) {}
}

export interface AirportList {
  airportCode: string;
  airportId: number;
  airportName: string;
  cityId: number;
  cityName: string;
}

export interface APIResponseModel {
  message: string;
  result: boolean;
  data: any;
}

export interface FlightList {
  flightId: number;
  flightNumber: string;
  arrivalTime: string;
  departureTime: string;
  price: number;
  totalSeats: number;
  arrivalAirportName: string;
  arrivalAirportCode: string;
  departureAirportName: string;
  departureAirportCode: string;
  vendorName: string;
  vendorLogoUrl: string;
  travelDate: string;
}

export interface CustomerModel {
  customerId: number;
  name: string;
  mobileNo: string;
  email: string;
  city: string;
  address: string;
  password: string;
}

export interface BookingRecord {
  bookingId: number;
  flightId: number;
  customerId: number;
  bookingDate: string;
  totalAmount: number;
  FlightBookingTravelers: TravelerModel[];
}

export interface TravelerModel {
  travelerName: string;
  contactNo: string;
  aadharNo: string;
  seatNo: number;
}
