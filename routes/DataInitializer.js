const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')

async function createAdminUserIfNotExists() {
    try {
      const adminUser = await User.findOne({ role: 'admin' });
  
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash('admin', 10); 
        const newUser = new User({
          fullname: 'Admin',
          email: 'admin@Elkindy.com',
          password: hashedPassword,
          role: 'admin',
          adress: 'Admin Address',
          phone: '123456789',
          birthday: '1999-01-01',
          image: "uploads\\administrateur.png",
          status: true
        });
  
        await newUser.save();
        console.log('Admin user created successfully.');
      }
    } catch (err) {
      console.error('Error creating admin user:', err.message);
    }
  }
  
  
  module.exports = { createAdminUserIfNotExists };
  