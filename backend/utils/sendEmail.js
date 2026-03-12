const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {

    const { data, error } = await resend.emails.send({
        from: "RunYatra <onboarding@resend.dev>",
        to: [to],
        subject,
        text
    });

    console.log("EMAIL DATA:", data);
    console.log("EMAIL ERROR:", error);
};

module.exports = sendEmail;
