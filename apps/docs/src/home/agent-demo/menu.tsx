"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@loamui/core";
import "./menu.css";

const courses = [
  {
    title: "Starter",
    status: "vegetarian",
    label: "Vegetarian",
    dishes: [
      ["Burrata", "Heritage tomatoes, basil oil, sourdough crumb", "£9.50"],
      ["Roast beetroot", "Whipped goat's curd, hazelnuts, dill", "£8.00"],
      ["Wild mushroom toast", "Garlic butter, parsley, poached egg", "£8.50"],
    ],
  },
  {
    title: "Dessert",
    status: "sold-out",
    label: "Sold out",
    dishes: [
      ["Sticky toffee pudding", "Date sponge, butterscotch, clotted cream", "£7.50"],
      ["Lemon posset", "Shortbread, raspberries", "£6.50"],
      ["Chocolate tart", "Salted caramel, crème fraîche", "£7.00"],
    ],
  },
] as const;

export function RestaurantMenu({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const CourseHeading = headingLevel === 2 ? "h3" : "h4";
  const [starterSelected, setStarterSelected] = useState(false);
  return (
    <section className="menu">
      <Heading>Menu</Heading>
      <p className="demo-note">Try a selection. This demo does not place an order.</p>
      {courses.map(({ title, status, label, dishes }) => (
        <Card key={title}>
          <div className={`menu-card ${status}`}>
            <CourseHeading>
              {title}{" "}
              <Badge.Root>
                <Badge.Text>{label}</Badge.Text>
              </Badge.Root>
            </CourseHeading>
            <dl>
              {dishes.map(([name, description, price]) => (
                <div key={name}>
                  <dt>
                    {name} <data value={price.slice(1)}>{price}</data>
                  </dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
            <footer>
              <Button
                disabled={status === "sold-out"}
                onClick={() => setStarterSelected((selected) => !selected)}
              >
                {status === "sold-out"
                  ? "Dessert unavailable"
                  : starterSelected
                    ? "Remove starter"
                    : "Add starter"}
              </Button>
            </footer>
          </div>
        </Card>
      ))}
      <p className="selection" role="status">
        {starterSelected ? "Starter added to your demo selection." : "No courses selected."}
      </p>
    </section>
  );
}
