import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { medications, medicationLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meds = await db
      .select()
      .from(medications)
      .where(eq(medications.userId, session.user.id))
      .orderBy(desc(medications.active));

    return NextResponse.json(meds);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, dosage, frequency } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Medication name is required" },
        { status: 400 }
      );
    }

    const [med] = await db
      .insert(medications)
      .values({
        userId: session.user.id,
        name,
        dosage: dosage || null,
        frequency: frequency || null,
      })
      .returning();

    return NextResponse.json(med, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { medicationId, skipped } = await req.json();

    if (!medicationId) {
      return NextResponse.json(
        { error: "Medication ID is required" },
        { status: 400 }
      );
    }

    const [log] = await db
      .insert(medicationLogs)
      .values({
        medicationId,
        userId: session.user.id,
        skipped: skipped ?? false,
      })
      .returning();

    return NextResponse.json(log);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
