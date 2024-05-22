const fs = require('fs');
const filePath = './data.json';
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//readFileData will always get called in creating, showing, updating, and removing product(s)
//this will also ensure that the data.json that will be created is an Array
//data.json MUST be an Array because it will give us the ".push()" method
//".push()" is the method that we will be needing in adding product to our local database(data.json)
const readFileData = () => {
   try {const data = fs.readFileSync(filePath, 'utf8');
   return JSON.parse(data);
} catch (err){
   if(err.code === 'ENOENT'){
      return [];
   }
   else {
      throw err;
   }
}
}

//this is for ID checking, so that there will be no duplication of product ID
const checkIdIfExist = (productsData, productId) => {
   if(productsData.some(item => item.id === productId)){
      return true;
   }
}

//this is for checking if ID exists before continuing creating product process
const productIdQuestion = (fn) => {
    return rl.question('Enter product id:', async (id) => {
      const products = await readFileData();
        if(checkIdIfExist(products, id)){
            console.log('ID ALREADY EXISTS!');
            productIdQuestion(fn);
        } else {
            fn(id);
        };
    })
}

//this is for checking if ID exists before continuing updating product process
const productIdToUpdateQuestion = (fn) => {
    return rl.question('Enter the ID of the product you want to update:', async (id) => {
      const products = await readFileData();
        if(!checkIdIfExist(products, id)){
            console.log('ID DOES NOT EXISTS!');
            productIdToUpdateQuestion(fn);
        } else {
            fn(id);
        };
    })
}

//this is for checking if ID exists before continuing removing product process
const productIdToRemoveQuestion = (fn) => {
    return rl.question('Enter the ID of the product you want to delete:', async (id) => {
      const products = await readFileData();
        if(!checkIdIfExist(products, id)){
            console.log('ID DOES NOT EXISTS!');
            productIdToRemoveQuestion(fn);
        } else {
            fn(id);
        };
    })
}


//CREATE A PRODUCT
const createAProduct = async (product) => {
   const productsData = await readFileData();
   checkIdIfExist(productsData, product.id);
   await productsData.push(product);
   writeDataToDB(productsData);
   return 'PRODUCT ADDED SUCCESSFULLY!'
}

//SHOWING PRODUCTS THAT HAS STOCKS STARTING FROM THE NEWLY ADDED
const showProductsThatHasStocks = () => {
   const productsData = readFileData();
   const productWithStocks = productsData.filter(item => item.quantity > 0).map(
      item => ({name: item.name, unit_price: item.unit_price, totalPrice: item.quantity * item.unit_price})
   ).sort((a,b) => a.id - b.id);
   return productWithStocks;
}

//UPDATE A PRODUCT
const updateAProduct = async (productId, updatedDetails) => {
   const productsData = await readFileData();
   const itemIndex = productsData.findIndex(item => item.id === productId);
   productsData[itemIndex] = {...productsData[itemIndex], ...updatedDetails};
   writeDataToDB(productsData);
   return 'PRODUCT DETAILS SUCCESSFULLY UPDATED!';
}

//REMOVE A PRODUCT
const removeAProduct = async (productId) => {
   const productsData = await readFileData();
   const newProductList = productsData.filter(item => item.id !== productId);
   writeDataToDB(newProductList);
   return 'PRODUCT HAS BEEN REMOVED SUCCESSFULLY!';
}

//writing to database method
function writeDataToDB(productsData) {
   fs.writeFileSync(filePath, JSON.stringify(productsData, null, 2));
}


module.exports = { createAProduct, showProductsThatHasStocks, updateAProduct, productIdQuestion, productIdToUpdateQuestion, productIdToRemoveQuestion, removeAProduct, rl }
