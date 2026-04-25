export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, message } = body;

    console.log("📩 New Contact Message:");
    console.log(name, email, message);

    return Response.json({
      success: true,
      message: "Message received!",
    });

  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}