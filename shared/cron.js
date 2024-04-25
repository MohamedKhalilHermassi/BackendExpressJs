const nodeCron = require('node-cron');
const cosineDistance = require('compute-cosine-distance');
const Product = require('../models/product');
const User = require('../models/user');
const Note = require('../models/notes');
const Order = require('../models/order');
const natural = require('natural');
const { removeStopwords, fra } = require('stopword')

const cronFiltrageCollaboratif = () => {
    nodeCron.schedule('* * * * *', async () => {
        try {
            const listProducts = await Product.find();
            const nbProducts = listProducts.length;
    
            const listUsers = await User.find();
            const nbUsers = listUsers.length;
            const matriceNotes = Array.from({ length: nbUsers }, () => Array(nbProducts).fill(0));
    
            const listNotes = await Note.find();
    
            for (const note of listNotes) {
                for (let i = 0; i < listUsers.length; i++) {
                    for (let j = 0; j < listProducts.length; j++) {
                        if (note.userid.equals(listUsers[i]._id) && note.productid.equals(listProducts[j]._id)) {
                            //console.log(`i= ${i}, j= ${j}, ${note.note}`);
                            matriceNotes[i][j] = note.note;
                        }
                    }
                }
            }
    
            const matriceSimUser = Array.from({ length: nbUsers }, () => Array(nbUsers).fill(0));
    
            for (let x = 0; x < nbUsers; x++) {
                for (let y = 0; y < nbUsers; y++) {
                    const matriceNotesX = matriceNotes[x];
                    const matriceNotesY = matriceNotes[y];
                    const similarity = 1 - cosineDistance(matriceNotesX, matriceNotesY);
                    matriceSimUser[x][y] = x === y ? 1 : similarity;;
                }
            }
            for (let i = 1; i < nbUsers; i++) {
                let voisin1 = 0, sim1 = 0, voisin2 = 0, sim2 = 0, voisin3 = 0, sim3 = 0;
                for (let j = 0; j < nbUsers; j++) {
                    const similarity = matriceSimUser[i][j];
                    if (similarity > sim1 && similarity < 1) {
                        sim1 = similarity;
                        voisin1 = j;
                    }
                    if (similarity > sim2 && similarity < sim1) {
                        sim2 = similarity;
                        voisin2 = j;
                    }
                    if (similarity > sim3 && similarity < sim2) {
                        sim3 = similarity;
                        voisin3 = j;
                    }
                }
                const voisins = [voisin1, voisin2, voisin3];
                //console.log(voisins);
                const bestproducts = [];
                const orders = await Order.find({user: listUsers[i]._id});
                const orderedProducts = [];
                console.log(orders);
                for(o of orders){
                    for(p of o.products){
                        if(!orderedProducts.includes(p)){
                            orderedProducts.push(p);
                        }
                    }
                }
                for (v of voisins){
                    let topProd = 0;
                    for (let i = 0; i < nbProducts; i++) {
                        if((matriceNotes[v][i] > matriceNotes[v][topProd])&&(!orderedProducts.includes(listProducts[i]._id))&&(!bestproducts.includes(listProducts[i]))){
                            topProd = i;
                        }
                    }
                    bestproducts.push(listProducts[topProd]);
                }
                console.log(bestproducts);
                await User.findByIdAndUpdate(listUsers[i]._id,{
                    recommendedProducts: bestproducts
                });
            }
        } catch (error) {
            console.error(error);
        }
    });
}    

const cronBaseSurLeContenu = () => {
    nodeCron.schedule('* * * * *', async () => {
        try{
            const products = await Product.find();
            const nbProducts = products.length;
            const productDict = {};
            const tokenizer = new natural.AggressiveTokenizerFr();
            const totaliteMots = [];
            for (i=0; i< nbProducts; i++) {
              const product = products[i];
              const tokens = tokenizer.tokenize(product.productDescription);
              const filteredTokens = removeStopwords(tokens, fra);
              const stems = [];
              filteredTokens.forEach(token => {
                const stem = natural.CarryStemmerFr.stem(token);
                stems.push(stem);
                totaliteMots.push(stem);
              });
              productDict[i] = stems;
          }
            const matriceBinaire = Array.from({ length: nbProducts }, () =>
            Array.from({ length: totaliteMots.length }, () => 0)
            );
            for (let i = 0; i < nbProducts; i++) {
              let j = 0;
              totaliteMots.forEach(mot => {
                if(productDict[i].includes(mot)){
                  matriceBinaire[i][j] = 1;
                  j++;
                }
              });
            }
          
            const matriceSimilarite = Array.from({ length: nbProducts }, () =>
            Array.from({ length: nbProducts }, () => 0)
            );
          
            for (let x = 0; x < nbProducts; x++) {
              for (let y = 0; y < nbProducts; y++) {
                  const matriceBinaireX = matriceBinaire[x];
                  const matriceBinaireY = matriceBinaire[y];
                  const similarity = 1 - cosineDistance(matriceBinaireX, matriceBinaireY);
                  matriceSimilarite[x][y] = x === y ? 1 : similarity;
              }
          }
          for (let i = 0; i < nbProducts; i++) {
            let similaire1 = 0, sim1 = 0, similaire2 = 0, sim2 = 0, similaire3 = 0, sim3 = 0;
            for (let j = 0; j < nbProducts; j++) {
                const similarity = matriceSimilarite[i][j];
                if (similarity > sim1 && similarity < 1) {
                    sim1 = similarity;
                    similaire1 = j;
                }
                if (similarity > sim2 && similarity < sim1) {
                    sim2 = similarity;
                    similaire2 = j;
                }
                if (similarity > sim3 && similarity < sim2) {
                    sim3 = similarity;
                    similaire3 = j;
                }
            }
            const similaires = [similaire1, similaire2, similaire3];
            //console.log(voisins);
            const produitsSimilaires = [];
            console.log(`top 1 du produit ${i} est d'indice ${similaires[0]}`);
            for(s of similaires){
              produitsSimilaires.push(products[s])
            }
            await Product.findByIdAndUpdate(products[i]._id,{
              produitsSimilaires: produitsSimilaires
            });
          }

        }catch(error){
            console.error(error);
        }
    });
}
module.exports = {
    cronFiltrageCollaboratif,
    cronBaseSurLeContenu
};
