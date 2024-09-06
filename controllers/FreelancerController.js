const Freelancer = require('../models/freelancer.model');
const Work = require('../models/work.model');

class FreelancerController {
  // Method to get the freelancer dashboard page
  static async getDashboardPage(req, res) {
    try {
    //   // Assuming the freelancer's ID is stored in the session or JWT token
    //   const freelancerId = req.user._id; // Replace with actual method of getting freelancer ID

    //   // Fetch freelancer data along with their work
    //   const freelancer = await Freelancer.findById(freelancerId).populate('workInHand');

    //   if (!freelancer) {
    //     return res.status(404).send('Freelancer not found');
    //   }

    //   // Calculate analytics data
    //   const totalEarnings = freelancer.workInHand.reduce((sum, work) => sum + work.earnings, 0);

    //   const workStatusCounts = freelancer.workInHand.reduce(
    //     (counts, work) => {
    //       counts[work.status] = (counts[work.status] || 0) + 1;
    //       return counts;
    //     },
    //     { 'in progress': 0, completed: 0, pending: 0 }
    //   );

      // Render the dashboard template with the freelancer's data and analytics
      res.render('freelancersDashboard', {
        // freelancer,
        // totalEarnings,
        // workStatusCounts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = FreelancerController;
