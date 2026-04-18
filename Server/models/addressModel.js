/** @format */

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Home", "Work", "Other"],
    },

    street: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    zipCode: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    isDefault: {
      type: Boolean,
      required: true,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Address", addressSchema);
