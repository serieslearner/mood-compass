import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, currentPassword, newPassword } = body;

    // Update name
    if (name !== undefined) {
      await db
        .update(users)
        .set({ name, updatedAt: new Date() })
        .where(eq(users.id, session.user.id));
    }

    // Update password
    if (currentPassword && newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters" },
          { status: 400 }
        );
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

      if (!user?.hashedPassword) {
        return NextResponse.json(
          { error: "Cannot change password for OAuth accounts" },
          { status: 400 }
        );
      }

      const valid = await bcrypt.compare(currentPassword, user.hashedPassword);
      if (!valid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await db
        .update(users)
        .set({ hashedPassword, updatedAt: new Date() })
        .where(eq(users.id, session.user.id));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
