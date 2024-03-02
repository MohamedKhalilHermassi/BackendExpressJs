const courseType = {
    solfege : 'Solfege',
    instrument : 'Instrument',
};


const productCondition = {
    new:'Brand New',
    used:'Slightly  ',
    old:'Old'
}
const productType = {
    book:'book',
    instrument:'instrument',
    
}

Object.freeze(productCondition);
Object.freeze(courseType);
Object.freeze(productType);


module.exports ={
    courseType,
    productCondition,
    productType
};