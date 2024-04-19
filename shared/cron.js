const nodeCron = require('node-cron');
const cosineDistance = require('compute-cosine-distance');
const Product = require('../models/product');
const User = require('../models/user');
const Note = require('../models/notes');

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
                    matriceSimUser[x][y] = similarity;
                }
            }
            for (let i = 0; i < nbUsers; i++) {
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
                for (v of voisins){
                    let topProd = 0;
                    for (let i = 0; i < nbProducts; i++) {
                        if(matriceNotes[v][i] > matriceNotes[v][topProd]){
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
module.exports = cronFiltrageCollaboratif;