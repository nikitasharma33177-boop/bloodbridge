// 🩸 Replace with your Supabase credentials
const SUPABASE_URL = "https://gihlvhitxhqyjupasyop.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaGx2aGl0eGhxeWp1cGFzeW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDI3ODgsImV4cCI6MjA3Njg3ODc4OH0.A-f_5qlcclGBHl4O8EUj3803lf165BumixN1aZW_E8Q";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================
// Donor Registration
// ============================
const donorForm = document.getElementById("donor-form");
if (donorForm) {
  donorForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const blood_group = document.getElementById("blood_group").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;

    const { data, error } = await supabaseClient
      .from("donors")
      .insert([{ name, blood_group, email, date }]);

    if (error) {
      alert("❌ Error saving donor data!");
      console.error(error);
    } else {
      donorForm.style.display = "none";
      document.getElementById("thankyou-message").style.display = "block";
      document.getElementById("donor-name").textContent = name;
      document.getElementById("donation-date").textContent = date;
    }
  });
}

// ============================
// Organizer Registration
// ============================
const eventForm = document.getElementById("event-form");
if (eventForm) {
  eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const camp_name = document.getElementById("camp_name").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("event_date").value;
    const contact = document.getElementById("contact").value;

    const { error } = await supabaseClient
      .from("blood_drive")
      .insert([{ camp_name, location, date, contact }]);

    if (!error) {
      alert("✅ Blood drive registered successfully!");
      eventForm.reset();
      loadOrganizerEvents();
    } else console.error(error);
  });
}

// ============================
// Load Drives on Homepage
// ============================
async function loadEvents() {
  const eventsList = document.getElementById("events-list");
  if (!eventsList) return;

  const { data } = await supabaseClient
    .from("blood_drive")
    .select("*")
    .order("date", { ascending: true });

  if (data.length === 0) {
    eventsList.innerHTML = "<p>No upcoming drives yet.</p>";
    return;
  }

  eventsList.innerHTML = data
    .map(
      (e) => `
      <div class="event-card">
        <h3>${e.camp_name}</h3>
        <p>${e.location} – ${e.date}</p>
        <p>📞 ${e.contact}</p>
      </div>`
    )
    .join("");
}
loadEvents();

// ============================
// Load Drives on Organizer Page
// ============================
async function loadOrganizerEvents() {
  const div = document.getElementById("organiser-events");
  if (!div) return;

  const { data } = await supabaseClient
    .from("blood_drive")
    .select("*")
    .order("date", { ascending: true });

  div.innerHTML = data
    .map(
      (e) => `
      <div class="event-card">
        <h3>${e.camp_name}</h3>
        <p>${e.location} – ${e.date}</p>
        <p>📞 ${e.contact}</p>
      </div>`
    )
    .join("");
}
loadOrganizerEvents();

// ============================
// Generate Donor Certificate
// ============================
function generateCertificate() {
  const name = document.getElementById("donor-name").textContent;
  const date = document.getElementById("donation-date").textContent;
  const certText = `🎖 Certificate of Appreciation 🎖

This is to certify that ${name} has donated blood on ${date}.
Your selfless act will help save lives.

With gratitude,
❤ BloodLink Team ❤`;

  const blob = new Blob([certText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name}_BloodLink_Certificate.txt`;
  link.click();
}