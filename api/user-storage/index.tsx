import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  IUser,
  IUsers,
  Session,
  Sessions,
  Bookings,
  Event,
  Events,
  Products,
} from '../types';

// helper to get user from AsyncStorage
export async function getStoredMe(): Promise<IUser | null> {
  const storedMe = await AsyncStorage.getItem('pt_me');
  return storedMe ? JSON.parse(storedMe) : null;
}

export async function getStoredUser(): Promise<IUsers | null> {
  const storedUser = await AsyncStorage.getItem('pt_user');
  return storedUser ? JSON.parse(storedUser) : null;
}

export async function getStoredUsers(): Promise<IUsers | null> {
  const storedUsers = await AsyncStorage.getItem('pt_users');
  return storedUsers ? JSON.parse(storedUsers) : null;
}

export async function getStoredSessions(): Promise<Sessions | null> {
  const storedSessions = await AsyncStorage.getItem('pt_sessions');
  return storedSessions ? JSON.parse(storedSessions) : null;
}

export async function getStoredBookings(): Promise<Bookings | null> {
  const storedBookings = await AsyncStorage.getItem('pt_bookings');
  return storedBookings ? JSON.parse(storedBookings) : null;
}

export async function getStoredEvent(): Promise<Event | null> {
  const storedEvent = await AsyncStorage.getItem('pt_event');
  return storedEvent ? JSON.parse(storedEvent) : null;
}

export async function getStoredEvents(): Promise<Events | null> {
  const storedEvents = await AsyncStorage.getItem('pt_events');
  return storedEvents ? JSON.parse(storedEvents) : null;
}

export async function getStoredProducts(): Promise<Products | null> {
  const storedProducts = await AsyncStorage.getItem('pt_products');
  return storedProducts ? JSON.parse(storedProducts) : null;
}

export async function setStoredMe(user: IUser): Promise<void> {
  await AsyncStorage.setItem('pt_me', JSON.stringify(user));
}

export async function setStoredUser(user: IUser): Promise<void> {
  await AsyncStorage.setItem('pt_user', JSON.stringify(user));
}

export async function setStoredSession(session: Session): Promise<void> {
  await AsyncStorage.setItem('pt_session', JSON.stringify(session));
}

export async function setStoredEvent(event: Event): Promise<void> {
  await AsyncStorage.setItem('pt_event', JSON.stringify(event));
}

export async function setStoredUsers(users: IUsers): Promise<void> {
  await AsyncStorage.setItem('pt_users', JSON.stringify(users));
}

export async function setStoredSessions(sessions: Sessions): Promise<void> {
  await AsyncStorage.setItem('pt_sessions', JSON.stringify(sessions));
}

export async function setStoredBookings(bookings: Bookings): Promise<void> {
  await AsyncStorage.setItem('pt_bookings', JSON.stringify(bookings));
}

export async function setStoredEvents(events: Events): Promise<void> {
  await AsyncStorage.setItem('pt_events', JSON.stringify(events));
}

export async function setStoredProducts(products: Products): Promise<void> {
  await AsyncStorage.setItem('pt_products', JSON.stringify(products));
}

export async function clearStoredMe(): Promise<void> {
  await AsyncStorage.removeItem('pt_me');
}

export async function clearStoredUser(): Promise<void> {
  await AsyncStorage.removeItem('pt_user');
}

export async function clearStoredSession(): Promise<void> {
  await AsyncStorage.removeItem('pt_session');
}

export async function clearStoredEvent(): Promise<void> {
  await AsyncStorage.removeItem('pt_event');
}

export async function clearStoredEvents(): Promise<void> {
  await AsyncStorage.removeItem('pt_events');
}

export async function clearStoredUsers(): Promise<void> {
  await AsyncStorage.removeItem('pt_users');
}

export async function clearStoredProducts(): Promise<void> {
  await AsyncStorage.removeItem('pt_products');
}
