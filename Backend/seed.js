// Populates the database with a starter catalog of services and a few sample
// partners so the frontend has real data to display.
//
// Usage:  node seed.js

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const dbConnect = require("./db/db");
const serviceModel = require("./model/service.model");
const categoryModel = require("./model/category.model");
const partnerModel = require("./model/partner.model");

const services = [
  { name: "Plumber", category: "Repairs", images: ["/img/plumber.jpg"], image: "/img/plumber.jpg", description: "Leak repair, bathroom fitting, and all plumbing work.", startingPrice: 299, durationMins: 60, inclusions: ["Visit & inspection", "Basic tools", "30-day warranty"] },
  { name: "Electrician", category: "Repairs", images: ["/img/plumber.jpg"], image: "/img/plumber.jpg", description: "Wiring, switch boards, fan and appliance installation.", startingPrice: 249, durationMins: 60, inclusions: ["Visit & inspection", "Safety check", "30-day warranty"] },
  { name: "Painter", category: "Renovation", images: ["/img/living.jpg"], image: "/img/living.jpg", description: "Interior, exterior and texture painting.", startingPrice: 999, durationMins: 240, inclusions: ["Free site visit", "Surface prep", "Clean-up"] },
  { name: "AC Repair", category: "Appliances", images: ["/img/ac.jpg"], image: "/img/ac.jpg", description: "AC servicing, gas filling and installation.", startingPrice: 399, durationMins: 90, inclusions: ["Power-jet cleaning", "Gas pressure check", "30-day warranty"] },
  { name: "Home Cleaning", category: "Cleaning", images: ["/img/living.jpg"], image: "/img/living.jpg", description: "Deep cleaning for homes and apartments.", startingPrice: 299, durationMins: 180, inclusions: ["Trained crew", "Eco-safe supplies", "Re-clean guarantee"] },
  { name: "Kitchen Deep Clean", category: "Cleaning", images: ["/img/kitchen.jpg"], image: "/img/kitchen.jpg", description: "Chimney, cabinets, tiles and appliances.", startingPrice: 799, durationMins: 180, inclusions: ["Degreasing", "Cabinet interiors", "Re-clean guarantee"] },
  { name: "Carpenter", category: "Repairs", images: ["/img/kitchen.jpg"], image: "/img/kitchen.jpg", description: "Furniture repair, fittings and custom woodwork.", startingPrice: 499, durationMins: 120, inclusions: ["Visit & quote", "Basic fittings", "Clean-up"] },
  { name: "Appliance Repair", category: "Appliances", images: ["/img/ac.jpg"], image: "/img/ac.jpg", description: "Washing machine, fridge and microwave repair.", startingPrice: 349, durationMins: 90, inclusions: ["Diagnosis", "Genuine parts quoted", "30-day warranty"] },
];

const LONAVLA = ["410401", "410403"];
const partnerSeeds = [
  { name: "Ramesh Plumbing Services", phone: "9800000001", serviceName: "Plumber", city: "Lonavla", pincodes: LONAVLA },
  { name: "Sharma Electricals", phone: "9800000002", serviceName: "Electrician", city: "Lonavla", pincodes: LONAVLA },
  { name: "Perfect Home Painting", phone: "9800000003", serviceName: "Painter", city: "Lonavla", pincodes: LONAVLA },
  { name: "CoolCare AC Services", phone: "9800000004", serviceName: "AC Repair", city: "Lonavla", pincodes: LONAVLA },
  { name: "SparkClean Pros", phone: "9800000005", serviceName: "Home Cleaning", city: "Pune", pincodes: ["411001", "411038"] },
  { name: "Gupta Carpentry Works", phone: "9800000006", serviceName: "Carpenter", city: "Pune", pincodes: ["411001", "410401"] },
];

async function seed() {
  await dbConnect();

  const cats = {};
  for (const name of ["Repairs", "Appliances", "Cleaning", "Renovation"]) {
    cats[name] = await categoryModel.findOneAndUpdate({ name }, { name }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  const savedServices = {};
  for (const service of services) {
    const doc = await serviceModel.findOneAndUpdate(
      { name: service.name },
      { ...service, category: cats[service.category]._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    savedServices[service.name] = doc;
  }
  console.log(`Seeded ${services.length} services.`);

  for (const partner of partnerSeeds) {
    const service = savedServices[partner.serviceName];
    if (!service) continue;

    await partnerModel.findOneAndUpdate(
      { phone: partner.phone },
      { name: partner.name, phone: partner.phone, service: [service._id], serviceablePincodes: partner.pincodes, location: { city: partner.city, state: "Maharashtra", pincode: partner.pincodes[0] } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Seeded ${partnerSeeds.length} partners.`);

  await mongoose.connection.close();
  console.log("Done.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
