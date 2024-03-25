
const Status = {
    incoming : 'Incoming',
    finished : 'Finished',
    canceled : 'Canceled',
};

const Category = {
    concert : 'Concert',
    audition : 'Audition',
    charity : 'Charity',
};

Object.freeze(Status);
Object.freeze(Category);


module.exports ={
    Status,
    Category
};