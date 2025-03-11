const Ngo = require("../models/Ngo");
const Resort = require("../models/Resort");

// Controller to get all registered NGOs
const getAllNgos = async (req, res) => {
    try {
        const ngos = await Ngo.find();
        res.status(200).json({ success: true, ngos });
    } catch (error) {
        console.error("Error fetching NGOs:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Controller to get all registered Resorts
const getAllResorts = async (req, res) => {
    try {
        const resorts = await Resort.find();
        res.status(200).json({ success: true, resorts });
    } catch (error) {
        console.error("Error fetching Resorts:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Approve or Reject NGO
const approveNgo = async (req, res) => {
    try {
        const { ngoId } = req.params;
        const { isApproved, adminComments } = req.body;

        console.log("🔹 Received request to update NGO:", { ngoId, isApproved, adminComments });

        if (!ngoId) {
            console.error("❌ Error: Missing NGO ID");
            return res.status(400).json({ success: false, message: "Invalid NGO ID" });
        }

        // Fetch the existing NGO
        const existingNgo = await Ngo.findById(ngoId);
        if (!existingNgo) {
            console.error("❌ Error: NGO not found in database");
            return res.status(404).json({ success: false, message: "NGO not found" });
        }

        console.log("✅ NGO Found:", existingNgo);

        // Ensure `phone_no` is retained
        const updatedNgo = await Ngo.findByIdAndUpdate(
            ngoId,
            {
                isApproved: isApproved ?? existingNgo.isApproved,
                adminComments: adminComments ?? existingNgo.adminComments,
                phone_no: existingNgo.phone_no, // Retain phone_no to prevent validation errors
            },
            { new: true, runValidators: true }
        );

        console.log("✅ NGO updated successfully:", updatedNgo);
        res.status(200).json({ success: true, message: "NGO approval status updated", ngo: updatedNgo });

    } catch (error) {
        console.error("❌ Error in approveNgo:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};



// Update NGO details
const updateNgo = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const ngo = await Ngo.findById(id);
        if (!ngo) {
            return res.status(404).json({ message: "NGO not found" });
        }

        ngo.adminComments = comment;
        await ngo.save();

        res.status(200).json({ message: "NGO updated successfully", ngo });
    } catch (error) {
        console.error("Error updating NGO:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Approve or Reject Resort
const approveResort = async (req, res) => {
    try {
        const { resortId } = req.params;
        const { isApproved, adminComments } = req.body;

        const updatedResort = await Resort.findByIdAndUpdate(
            resortId,
            { isApproved, adminComments },
            { new: true, runValidators: true }
        );

        if (!updatedResort) {
            return res.status(404).json({ success: false, message: "Resort not found" });
        }

        res.status(200).json({ success: true, message: "Resort approval status updated", resort: updatedResort });
    } catch (error) {
        console.error("Error updating Resort approval:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { getAllNgos, getAllResorts, approveNgo, approveResort, updateNgo };