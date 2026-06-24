const router = require("express").Router();
const Record = require("../models/Record");
const { protect, admin } = require("../middleware/authMiddleware");


router.post("/", protect, async (req, res) => {
  const record = await Record.create({
    title: req.body.title,
    description: req.body.description,
    createdBy: req.user._id,
  });

  res.json(record);
});


router.get("/", protect, async (req, res) => {
  if (req.user.role === "admin") {
    const data = await Record.find().populate("createdBy");
    return res.json(data);
  }

  const data = await Record.find({ createdBy: req.user._id });
  res.json(data);
});


router.put("/:id", protect, admin, async (req, res) => {
  const updated = await Record.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updated);
});


router.delete("/:id", protect, async (req, res) => {
  const record = await Record.findById(req.params.id);

  if (
    req.user.role === "admin" ||
    record.createdBy.toString() === req.user._id.toString()
  ) {
    await record.deleteOne();
    return res.json({ msg: "Deleted" });
  }

  res.status(403).json({ msg: "Not allowed" });
});

module.exports = router;