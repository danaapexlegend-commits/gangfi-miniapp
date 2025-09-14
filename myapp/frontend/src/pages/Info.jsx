// pages/Info.jsx
import React, { useState } from "react";
import Modal from "../components/Modal";
import InfoButton from "../components/InfoButton";

export default function Info() {
  const [openModal, setOpenModal] = useState(null);

  const handleOpen = (name) => setOpenModal(name);
  const handleClose = () => setOpenModal(null);

  const referralCode = "ABC1234567";
  const inviterCode = "";
  const referralCount = 5;

  return (
    <div style={{ padding: 20, paddingBottom: 90 }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <InfoButton text="Referral code" onClick={() => handleOpen("referral")} />
        <InfoButton text="Add Twitter account" onClick={() => handleOpen("twitter")} />
        <InfoButton text="Add Instagram account" onClick={() => handleOpen("instagram")} />
        <InfoButton text="Follow us on social media" onClick={() => handleOpen("followus")} />
        <InfoButton text="Follow gangs on social media" onClick={() => handleOpen("followgangs")} />
        <InfoButton text="Your perks" onClick={() => handleOpen("perks")} />
        <InfoButton text="Your badge" onClick={() => handleOpen("badge")} />
        <InfoButton text="Investment: private sale" onClick={() => handleOpen("investment")} />
        <InfoButton text="Game mechanism" onClick={() => handleOpen("mechanism")} />
        <InfoButton text="Update info" onClick={() => handleOpen("update")} />
      </div>

      {/* Referral modal */}
      <Modal show={openModal === "referral"} onClose={handleClose} title="Referral Code">
        <p>Your code: <b>{referralCode}</b></p>
        <InfoButton
          text="Copy referral link"
          onClick={() => {
            navigator.clipboard.writeText(`https://gangfi.app?ref=${referralCode}`);
            alert("Referral link copied!");
          }}
        />
        <div style={{ marginTop: 10 }}>
          <label>Inviter code:</label>
          <input type="text" defaultValue={inviterCode} style={{ display: "block", width: "100%", padding: 6, marginTop: 5 }} />
        </div>
        <p style={{ marginTop: 10 }}>Users invited: {referralCount}</p>
      </Modal>

      {/* Twitter modal */}
      <Modal show={openModal === "twitter"} onClose={handleClose} title="Add Twitter account">
        <input type="text" placeholder="Enter your Twitter username" style={{ display: "block", width: "100%", padding: 8 }} />
      </Modal>

      {/* Instagram modal */}
      <Modal show={openModal === "instagram"} onClose={handleClose} title="Add Instagram account">
        <input type="text" placeholder="Enter your Instagram username" style={{ display: "block", width: "100%", padding: 8 }} />
      </Modal>

      {/* Follow us */}
      <Modal show={openModal === "followus"} onClose={handleClose} title="Follow us">
        <a href="https://twitter.com/gangfi" target="_blank" rel="noreferrer">Twitter</a><br />
        <a href="https://instagram.com/gangfi" target="_blank" rel="noreferrer">Instagram</a><br />
        <a href="https://t.me/gangfi" target="_blank" rel="noreferrer">Telegram</a>
      </Modal>

      {/* Follow gangs */}
      <Modal show={openModal === "followgangs"} onClose={handleClose} title="Follow gangs">
        <a href="https://twitter.com/gang1" target="_blank" rel="noreferrer">Gang1 Twitter</a><br />
        <a href="https://instagram.com/gang1" target="_blank" rel="noreferrer">Gang1 Instagram</a><br />
        <a href="https://twitter.com/gang2" target="_blank" rel="noreferrer">Gang2 Twitter</a><br />
        <a href="https://instagram.com/gang2" target="_blank" rel="noreferrer">Gang2 Instagram</a><br />
        <a href="https://twitter.com/gang3" target="_blank" rel="noreferrer">Gang3 Twitter</a><br />
        <a href="https://instagram.com/gang3" target="_blank" rel="noreferrer">Gang3 Instagram</a><br />
        <a href="https://twitter.com/gang4" target="_blank" rel="noreferrer">Gang4 Twitter</a><br />
        <a href="https://instagram.com/gang4" target="_blank" rel="noreferrer">Gang4 Instagram</a>
      </Modal>

      {/* Perks */}
      <Modal show={openModal === "perks"} onClose={handleClose} title="Your perks">
        <p>Coming soon...</p>
      </Modal>

      {/* Badge */}
      <Modal show={openModal === "badge"} onClose={handleClose} title="Your badge">
        <p>Coming soon...</p>
      </Modal>

      {/* Investment */}
      <Modal show={openModal === "investment"} onClose={handleClose} title="Private sale">
        <a href="https://privatesale.gangfi" target="_blank" rel="noreferrer">Go to private sale</a>
      </Modal>

      {/* Mechanism */}
      <Modal show={openModal === "mechanism"} onClose={handleClose} title="Game mechanism">
        <p>Game mechanism details (placeholder)...</p>
      </Modal>

      {/* Update */}
      <Modal show={openModal === "update"} onClose={handleClose} title="Update info">
        <p>Update information (placeholder)...</p>
      </Modal>
    </div>
  );
}
