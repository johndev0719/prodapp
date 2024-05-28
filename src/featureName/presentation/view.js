const {
  createAProduct,
  showProductsThatHasStocks,
  updateAProduct,
  productIdToUpdateQuestion,
  productIdQuestion,
  rl,
  productIdToRemoveQuestion,
  removeAProduct,
} = require("../data/repository_imp/repositoryImp");
const productModel = require("../data/model/product_model");

//prompt for creating product
const createAProductPrompt = () => {
  productIdQuestion((id) => {
    rl.question("Enter product name:", (name) => {
      rl.question("Enter product quantity:", (quantity) => {
        rl.question("Enter product unit price:", async (price) => {
          const result = await createAProduct(
            productModel(id, name, quantity, price)
          );
          console.log(result);
          userPrompt();
        });
      });
    });
  });
};

//show all the products that has stocks starting from newly added
const showListOfProductsAvailable = async () => {
  const results = await showProductsThatHasStocks();
  results.length === 0
    ? console.log("NO PRODUCTS AVAILABLE")
    : console.log("THIS IS THE LIST OF AVAILABLE PRODUCTS:\n", results);
  userPrompt();
};

//update the selected product
const updateAProductPrompt = () => {
  productIdToUpdateQuestion((id) => {
    // fieldToUpdate(id);
    rl.question("Enter quantity new value:", (quantity) => {
      rl.question("Enter unit price new value:", async (unit_price) => {
        const results = await updateAProduct(id, {
          quantity: parseInt(quantity),
          unit_price: parseFloat(unit_price),
        });
        const updatedList = await showProductsThatHasStocks();
        console.log(results);
        console.log(updatedList);
        userPrompt();
      });
    });
  }, userPrompt);
};

//remove the selected product
const removeAProductPrompt = () => {
  productIdToRemoveQuestion(async (id) => {
    const results = await removeAProduct(id);
    console.log(results);
    userPrompt();
  }, userPrompt);
};

//prompt for user interaction
function userPrompt() {
  rl.question(
    "What would you like to do?\n[1]Create a Product, [2]Show Available Products, [3]Update a Product, [4]Remove a Product, [5]Exit\n",
    (answer) => {
      switch (answer) {
        case "1":
          createAProductPrompt();
          break;
        case "2":
          showListOfProductsAvailable();
          break;
        case "3":
          updateAProductPrompt();
          break;
        case "4":
          removeAProductPrompt();
          break;
        case "5":
          console.log("Session Ended");
          rl.close();
          break;
        default:
          console.log("Invalid input. Please try again.");
          userPrompt();
      }
    }
  );
}

module.exports = userPrompt;
