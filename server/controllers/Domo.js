// TODO: change domo information, make sure it takes from the models domo information

const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  return res.render('app');
};

const makeDomo = async (req, res) => {
  if (!req.body.title || !req.body.company || !req.body.pay) {
    return res.status(400).json({ error: 'title, company, and pay are required!' });
  }

  const domoData = {
    title: req.body.title,
    company: req.body.company,
    pay: req.body.pay,
    type: req.body.type,
    applied: req.body.applied,
    status: req.body.status,
    owner: req.session.account._id,
  };


  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ title: newDomo.title, company: newDomo.company, pay: newDomo.pay });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists! ' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const deleteDomo = async (req, res) => {
  try {
    const id = req.body.id;
    await Domo.deleteOne({ _id: id, owner: req.session.account._id });
    return res.status(200).json({ message: 'Deleted!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to delete domo' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('title company pay type applied status').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  deleteDomo,
  getDomos,
};
