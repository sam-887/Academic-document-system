const express = require("express");
const Request = require("../models/Request");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  requireRole("admin", "faculty"),
  async (req, res) => {
    try {
      const days = Math.min(
        Math.max(parseInt(req.query.days || "30", 10), 1),
        365
      );

      const since = new Date();
      since.setDate(since.getDate() - days);

      const total = await Request.countDocuments({
        createdAt: { $gte: since }
      });

      const approved = await Request.countDocuments({
        status: { $in: ["APPROVED", "COMPLETED"] },
        createdAt: { $gte: since }
      });

      const rejected = await Request.countDocuments({
        status: "REJECTED",
        createdAt: { $gte: since }
      });

      const underReview = await Request.countDocuments({
        status: "UNDER_REVIEW",
        createdAt: { $gte: since }
      });

      const pending = await Request.countDocuments({
        status: "PENDING",
        createdAt: { $gte: since }
      });

      const generating = await Request.countDocuments({
        status: "GENERATING",
        createdAt: { $gte: since }
      });

      const byType = await Request.aggregate([
        {
          $match: {
            createdAt: { $gte: since }
          }
        },
        {
          $group: {
            _id: "$documentType",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      const approvedByType = await Request.aggregate([
        {
          $match: {
            createdAt: { $gte: since },
            status: { $in: ["APPROVED", "COMPLETED"] }
          }
        },
        {
          $group: {
            _id: "$documentType",
            count: { $sum: 1 }
          }
        }
      ]);

      const rejectedReasons = await Request.aggregate([
        {
          $match: {
            createdAt: { $gte: since },
            status: "REJECTED",
            remarks: { $nin: ["", null] }
          }
        },
        {
          $group: {
            _id: "$remarks",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);

      const timeline = await Request.aggregate([
        {
          $match: {
            createdAt: { $gte: since }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt"
              }
            },
            total: { $sum: 1 },
            approved: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["APPROVED", "COMPLETED"]] },
                  1,
                  0
                ]
              }
            },
            rejected: {
              $sum: {
                $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0]
              }
            },
            underReview: {
              $sum: {
                $cond: [{ $eq: ["$status", "UNDER_REVIEW"] }, 1, 0]
              }
            }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      res.json({
        period: days,
        total,
        approved,
        rejected,
        underReview,
        pending,
        generating,
        byType,
        approvedByType,
        rejectedReasons,
        timeline
      });
    } catch (err) {
      console.error("Analytics error:", err);
      res.status(500).json({
        message: "Failed to load analytics",
        error: err.message
      });
    }
  }
);

module.exports = router;

