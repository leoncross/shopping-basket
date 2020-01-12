# Shopping Basket:

1. [Task](#task)
2. [My Approach](#my_approach)
3. [Technologies used](#technologies)
4. [Installation](#installation)
5. [How to run the tests](#how_to_run_tests)
6. [How to run the app](#how_to_run_the_app)

# <a name="task">Task</a>:

The given task was as follows:

```
Write a program and associated unit tests that can price a basket of goods in a selected currency, accounting for special offers.

The goods that can be purchased, which are all priced in USD, are:
• Soup – $0.65 per tin
• Bread – $0.80 per loaf
• Milk – $1.15 per bottle
• Apples – $1.00 per bag

Current special offers are:
• Apples have 10 percent off their normal price
• Buy 3 Milks and get 50 cents off.
```

ACCEPTANCE CRITERIA

- The program should provide a RESTful API that allows a basket of items to be priced.
- The program should be flexible to allow for future extensibility
- The program should have error handling
- Fully tested

# <a name="my_approach">My Approach</a>:

To implement this, I initially started diagraming the communication throughout the application using UML diagrams. Through this, I identified that my key considerations were as follows:

- limit duplicate iterations of items
- allow easy scalability and future extensibility
- shop items / accepted currencies / discounts to be easily updated by a non-technical user

In the creation of this app, I followed a strict TDD approach of development - this involved writing a failing unit test for the feature I was implementing, writing the smallest code that would pass the test, then building the feature up. From then, I would refactor and remove superfluous tests / features as necessary.

Throughout development, I would ensure all unit and feature tests block any external API requests to ensure I do not breach the free limit request of CurrencyLayer. However, the full E2E tests do the full round trip, including the currency conversion call to CurrencyLayer.

With a key focus on scalability / future extensibility; the biggest design choice was to have an incredibly clean layout of my code and to follow the well known Model / View / Controller approach (MVC). This can be seen in the models directory; to keep logic clean and easy to follow, I pulled out the functionality and separated the argumentValidation and buy logic to ensure each file is contained and doesn't become bloated.

Further design consideration - by focusing on the items being easily updatable by a non-technical user, this led me slightly away from an incredibly simple, easy and (currently) suitable approach for the task at hand. For example, the current ACs allow for dedicated functions that would handle each items discount logic. However, if I were to follow this approach, it would be a heavy technical debt, as any future changes to the application would include a sizeable rewrite, and rethinking of the logic. Instead I sacrificed slightly the clean and simple approach and focused more on a scalable user-friendly upgradable approach. Each item can currently be very simply updated; discounts can be turned on, created, and removed by non-technical users.

Furthermore, by following the above design, I was able to hold all shop configurations within key/value pair objects - this would allow for these configs to be deployed to a database, which would further simplify changes to the offers / items by non-technical users.

### Moving forward:



# <a name="technologies">Technologies used</a>:
To achieve this challenge, I used the following technologies:

```
// app
express

// tests
chai
nock
sinon
supertest

// config
prettier
nyc
mocha
eslint
grunt

```
# <a name="installation">Installation</a>:

In an open terminal, type the following:

```
git clone https://github.com/leoncross/shopping-basket.git
cd shopping-basket
npm install

```

# <a name="how_to_run_tests">How to run the tests</a>:
In the shopping-basket directory, type the following into a terminal:

```
npm run test:unit
npm run test:feature
npm run test:e2e

```

To check for code quality and test coverage:
```
npm run coverage

```

# <a name="how_to_run_the_app">How to run the app</a>:
The best way to see a working example, is to use an API development tool such as Postman.

Postman allows one to test routes within the application, and pass arguments without the need for a front-end to be implemented.

After cloning this repo and navigating to the created directory, type the following into the terminal:

```
node index.js

```

From here, load up Postman and create a POST request to http://localhost:8080/shop/buy

In the body request, add the following urlencoded key / value pair:

```
key | value

currency | EUR
items[] | apple
items[] | apple
```

This should produce the following:

```
{
    "subtotal": 1.8,
    "discounts": [
        "10% off apples",
        "10% off apples"
    ],
    "discountAmt": 0.18,
    "total": 1.62,
    "currency": "EUR"
}

```

Feel free to play around with inputs to see full functionality of the application
