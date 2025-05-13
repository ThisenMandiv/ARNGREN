import Discount from '../Model/Discount.js';
import Promotion from '../Model/Promotion.js';
import User from '../Model/UserModel.js';

// Get discount usage report
export const getDiscountUsage = async (req, res) => {
    try {
        // Get all discounts
        const discounts = await Discount.find({});
        
        // Group discounts by month
        const monthlyUsage = {};
        discounts.forEach(discount => {
            // Use createdAt if available, otherwise use validUntil as a fallback
            const date = discount.createdAt || discount.validUntil;
            const month = new Date(date).toLocaleString('default', { month: 'long' });
            monthlyUsage[month] = (monthlyUsage[month] || 0) + 1;
        });

        // Group discounts by percentage range
        const percentageRanges = {
            '0-10%': 0,
            '11-20%': 0,
            '21-30%': 0,
            '31-40%': 0,
            '41-50%': 0,
            '51-60%': 0,
            '61-70%': 0,
            '71-80%': 0,
            '81-90%': 0,
            '91-100%': 0
        };

        discounts.forEach(discount => {
            const percentage = discount.percentage;
            if (percentage <= 10) percentageRanges['0-10%']++;
            else if (percentage <= 20) percentageRanges['11-20%']++;
            else if (percentage <= 30) percentageRanges['21-30%']++;
            else if (percentage <= 40) percentageRanges['31-40%']++;
            else if (percentage <= 50) percentageRanges['41-50%']++;
            else if (percentage <= 60) percentageRanges['51-60%']++;
            else if (percentage <= 70) percentageRanges['61-70%']++;
            else if (percentage <= 80) percentageRanges['71-80%']++;
            else if (percentage <= 90) percentageRanges['81-90%']++;
            else percentageRanges['91-100%']++;
        });

        // Prepare data for chart
        const chartData = {
            labels: Object.keys(percentageRanges),
            datasets: [{
                label: 'Discount Usage',
                data: Object.values(percentageRanges),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(199, 105, 212, 0.5)',
                    'rgba(155, 211, 128, 0.5)',
                    'rgba(232, 177, 125, 0.5)',
                    'rgba(127, 220, 213, 0.5)'
                ],
                borderWidth: 1
            }]
        };

        res.json(chartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get promotion performance report
export const getPromotionPerformance = async (req, res) => {
    try {
        // Get all promotions
        const promotions = await Promotion.find({});
        
        // Calculate status for each promotion
        const statusCounts = {
            Active: 0,
            Expired: 0,
            Upcoming: 0
        };
        
        const now = new Date();
        promotions.forEach(promotion => {
            const startDate = new Date(promotion.startDate);
            const endDate = new Date(promotion.endDate);
            
            if (now < startDate) {
                statusCounts.Upcoming++;
            } else if (now > endDate) {
                statusCounts.Expired++;
            } else {
                statusCounts.Active++;
            }
        });

        // Prepare data for chart
        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);

        res.json({
            labels,
            datasets: [{
                label: 'Promotion Performance',
                data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ]
            }]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user activity report
export const getUserActivity = async (req, res) => {
    try {
        // Get all users
        const users = await User.find({});
        
        // Group users by registration month
        const monthlyActivity = {};
        users.forEach(user => {
            const month = new Date(user.createdAt).toLocaleString('default', { month: 'long' });
            monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
        });

        // Prepare data for chart
        const labels = Object.keys(monthlyActivity);
        const data = Object.values(monthlyActivity);

        res.json({
            labels,
            datasets: [{
                label: 'User Activity',
                data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
