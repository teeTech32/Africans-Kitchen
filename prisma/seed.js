import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const dummyMeals = [
  {
    title: 'Assorted Vegetable Soup',
    slug: 'assorted-vegetable-soup',
    image: 'food3.jpeg',
    summary:
      'A well garnished assorted beef meat vegetable with a soft semo, served in a soft bun.',
    instructions: `
      1. Prepare the patty:
         Mix 200g of ground beef with salt and pepper. Form into a patty.

      2. Cook the patty:
         Heat a pan with a bit of oil. Cook the patty for 2-3 minutes each side, until browned.

      3. Assemble the burger:
         Toast the burger bun halves. Place lettuce and tomato on the bottom half. Add the cooked patty and top with a slice of cheese.

      4. Serve:
         Complete the assembly with the top bun and serve hot.
    `,
    creator: 'Timothy kunle',
    creator_email: 'atandatimothy26@gmail.com',
  },
  {
    title: 'Spicy Snacks',
    slug: 'spicy-curry',
    image: 'food5.jpeg',
    summary:
      'A rich and spicy snacks, infused with exotic spices and creamy coconut milk.',
    instructions: `
      1. Chop vegetables:
         Cut your choice of vegetables into bite-sized pieces.

      2. Sauté vegetables:
         In a pan with oil, sauté the vegetables until they start to soften.

      3. Add curry paste:
         Stir in 2 tablespoons of curry paste and cook for another minute.

      4. Simmer with coconut milk:
         Pour in 500ml of coconut milk and bring to a simmer. Let it cook for about 15 minutes.

      5. Serve:
         Enjoy this creamy curry with rice or bread.
    `,
    creator: 'Atanda Timothy',
    creator_email: 'ibikunle@gmail.com',
  },
  {
    title: 'Party Jollof & Fried Chiken',
    slug: 'party-jollof',
    image: 'food7.jpeg',
    summary:
      'Tender Party Jollof filled with fried chikens and fried plantains, steamed to perfection frehed tomatos and onions.',
    instructions: `
      1. Prepare the filling:
         Mix minced meat, shredded vegetables, and spices.

      2. Fill the dumplings:
         Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.

      3. Steam the dumplings:
         Arrange dumplings in a steamer. Steam for about 10 minutes.

      4. Serve:
         Enjoy these dumplings hot, with a dipping sauce of your choice.
    `,
    creator: 'Atanda Ibikunle',
    creator_email: 'ibikunle@gmail.com',
  },
  {
    title: 'Classic Chiken & Ice Creams',
    slug: 'classic-chiken-cream',
    image: 'food2.jpeg',
    summary:
      "Creamy Chiken and Ice Creams, a comforting classic chiken that's always a crowd-pleaser with plantains.",
    instructions: `
      1. Cook the macaroni:
         Boil macaroni according to package instructions until al dente.

      2. Prepare cheese sauce:
         In a saucepan, melt butter, add flour, and gradually whisk in milk until thickened. Stir in grated cheese until melted.

      3. Combine:
         Mix the cheese sauce with the drained macaroni.

      4. Bake:
         Transfer to a baking dish, top with breadcrumbs, and bake until golden.

      5. Serve:
         Serve hot, garnished with parsley if desired.
    `,
    creator: 'Atanda Marriam',
    creator_email: 'marriamA@gmail.com',
  },
  {
    title: 'Semo & Eggusi Soup',
    slug: 'semo-egusi-soup',
    image: 'food11.jpeg',
    summary:
      'Premium white semo with a tangy assorted Eggusi Soup, fresh ponmon, and tried chiken.',
    instructions: `
      1. Prepare the dough:
         Knead pizza dough and let it rise until doubled in size.

      2. Shape and add toppings:
         Roll out the dough, spread tomato sauce, and add your favorite toppings and cheese.

      3. Bake the pizza:
         Bake in a preheated oven at 220°C for about 15-20 minutes.

      4. Serve:
         Slice hot and enjoy with a sprinkle of basil leaves.
    `,
    creator: 'Atanda Marriam',
    creator_email: 'marriamA@gmail.com',
  },
  {
    title: 'Black Amala',
    slug: 'black-amala',
    image: 'food12.jpeg',
    summary:
      'Crispy, golden-brown amala with assorted beef meat and chiken, a classic Nigeria(Yoruba) dish.',
    instructions: `
      1. Prepare the veal:
         Pound veal cutlets to an even thickness.

      2. Bread the veal:
         Coat each cutlet in flour, dip in beaten eggs, and then in breadcrumbs.

      3. Fry the schnitzel:
      Heat oil in a pan and fry each schnitzel until golden brown on both sides.

      4. Serve:
      Serve hot with a slice of lemon and a side of potato salad or greens.
 `,
    creator: 'Atanda Ibikunle',
    creator_email: 'ibikunle@gmail.com',
  },
  {
    title: 'Pando With Okro',
    slug: 'pando-with-okro',
    image: 'food13.jpeg',
    summary:
      'A light and refreshing pando with seven lifes okro, fresh fish, and fried beef meats.',
    instructions: `
      1. Prepare the tomatoes:
        Slice fresh tomatoes and arrange them on a plate.
    
      2. Add herbs and seasoning:
         Sprinkle chopped basil, salt, and pepper over the tomatoes.
    
      3. Dress the salad:
         Drizzle with olive oil and balsamic vinegar.
    
      4. Serve:
         Enjoy this simple, flavorful salad as a side dish or light meal.
    `,
    creator: 'Timothy kunle',
    creator_email: 'atandatimothy26@gmail.com',
  },
];

const dummyUsers = [
  {
    name: 'Atanda Marriam',
    email: 'marriamA@gmail.com',
    password: 'marriam@3',
  },
  {
    name: 'Atanda Ibikunle',
    email: 'ibikunle@gmail.com',
    password: 'ibi#kunle',
  },
  {
    name: 'Timothy kunle',
    email: 'atandatimothy26@gmail.com',
    password: 'kunle',
  },
];

async function seed() {
  try {
    // Seed meals only if empty
    const mealCount = await prisma.meal.count();
    if (mealCount === 0) {
      await prisma.meal.createMany({ data: dummyMeals });
    }

    // Seed users only if empty
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      for (const user of dummyUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            password: hashedPassword,
          },
        });
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}
seed().catch(() => process.exit(1));
