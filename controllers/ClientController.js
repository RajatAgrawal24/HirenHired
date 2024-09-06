// controllers/clientController.js
const Client = require('../models/client.model');
const Freelancer = require('../models/freelancer.model');
const Work = require('../models/work.model');
const uploadOnCloudinary = require('../utils/cloudinary');

// Render Dashboard Page
const getDashboardPage = (req, res) => {
    res.render('clientDashboard');
};

// Get Client Profile
const getClientProfile = async (req, res) => {
    try {
        const client = await Client.findById(req.user._id).select('-password -refreshToken');
        res.json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get Nearby Freelancers
const getNearbyFreelancers = async (req, res) => {
    const { location } = req.query;
    try {
        // Simple location-based filtering. For more accurate results, consider geospatial queries.
        const freelancers = await Freelancer.find({ location: location }).select('-password -refreshToken');
        res.json(freelancers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Post New Work
const postWork = async (req, res) => {
    const { title, description } = req.body;
    if (!title || title.trim() === '') {
        return res.status(400).json({ success: false, message: 'Title is required' });
    }
    try {
        const newWork = new Work({
            clientId: req.user._id,
            title: title.trim(),
            description: description ? description.trim() : ''
        });
        await newWork.save();
        res.status(201).json(newWork);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get Client's Work Listings
const getClientWorks = async (req, res) => {
    try {
        const works = await Work.find({ clientId: req.user._id }).populate('assignedFreelancer', 'fullName username email avatar');
        res.json(works);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getDashboardPage,
    getClientProfile,
    getNearbyFreelancers,
    postWork,
    getClientWorks
};
