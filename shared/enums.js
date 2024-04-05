const courseType = {
    solfege : 'Solfege',
    instrument : 'Instrument',
};


const productCondition = {
    new:'New',
    used:'Slightly',
    old:'Old'
}

Object.freeze(productCondition);

const productType = {
    book:'book',
    instrument:'instrument',

}

Object.freeze(courseType);

const level = {
    niveau1 : 'Level 1',
    niveau2 : 'Level 2',
    niveau3 : 'Level 3',
    niveau4 : 'Level 4',
    niveau5 : 'Level 5',
    niveau6 : 'Level 6',
    niveau7 : 'Level 7',
};
Object.freeze(level);

Object.freeze(productType);
const classroomStatus = {
    available:'available',
    maintenance:'maintenance',

}

Object.freeze(classroomStatus);

const Status = {
    incoming : 'Incoming',
    finished : 'Finished',
    canceled : 'Canceled',
}

const Category = {
    concert : 'Concert',
    audition : 'Audition',
    charity : 'Charity',
};

Object.freeze(Status);
Object.freeze(Category);

module.exports ={
    courseType,
    level,
    productCondition,
    productType,
    classroomStatus,
    Status,
    Category
};