import { NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';

export async function GET() {
  // Gera 30 usuários fakes
  const users = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
  }));

  return NextResponse.json(users);
} 