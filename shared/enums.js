const courseType = {
    solfege : 'Solfege',
    instrument : 'Instrument',
};


const productCondition = {
    new:'Brand New',
    used:'Slightly Used',
    old:'Old'
}

Object.freeze(productCondition);
Object.freeze(courseType);


module.exports ={
    courseType,
    productCondition
};