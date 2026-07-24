// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./main";

afterEach(() => {
  cleanup();
  window.name = "";
  window.history.replaceState({}, "", "/");
});

describe("onboarding flow", () => {
  it("preserves selections and completes the account-to-trial sequence in the reference order", async () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "Get Started" })).toBeTruthy();
    expect(document.querySelectorAll(".welcome-row img")).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: "Get Started" }));

    expect(screen.getByText(/Imprint is a completely/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText(/helps you/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText(/Answer a few quick/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    const finance = screen.getByRole("button", { name: "Money & Finance" });
    expect(finance.getAttribute("aria-pressed")).toBe("true");
    const parenting = screen.getByRole("button", { name: "Parenting" });
    fireEvent.click(parenting);
    expect(parenting.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText("Great choices.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText(/I’m learning during my/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    const advanced = screen.getByRole("button", { name: /Advanced/ });
    expect(advanced.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText("Goal set.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fireEvent.click(screen.getByRole("button", { name: "Enable Notifications" }));
    fireEvent.click(screen.getByRole("button", { name: "Invite a Friend" }));

    const evening = screen.getByRole("button", { name: /Evening/ });
    expect(evening.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    const loadingButton = screen.getByRole("button", { name: "Continue" });
    expect(loadingButton.hasAttribute("disabled")).toBe(true);
    await waitFor(() => expect(loadingButton.hasAttribute("disabled")).toBe(false), {
      timeout: 3_000,
    });
    fireEvent.click(loadingButton);

    expect(screen.getByText(/This app is one/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText("Create an Account")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Continue with Google" }));

    expect(screen.getByText("We want you to try Imprint for free.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "I’m Ready" }));

    expect(screen.getByText("You’ll get a reminder 2 days before your trial ends.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Try for Free" }));

    expect(screen.getByText("Design Your Trial")).toBeTruthy();
    const freeTrial = screen.getByRole("button", { name: "Free, 7-Day Trial" });
    const monthlyTrial = screen.getByRole("button", { name: "3,99 €, 30-Day Trial" });
    expect(freeTrial.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(monthlyTrial);
    expect(monthlyTrial.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(freeTrial);
    fireEvent.click(screen.getByRole("button", { name: "Redeem 7 Days for $0.00" }));
    expect(screen.getByRole("status").textContent).toContain("App Store purchase");
  }, 8_000);

  it("supports back navigation on setup screens", () => {
    window.history.replaceState({}, "", "/?step=5");
    render(<App />);

    expect(screen.getByText(/Which of these topics/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Go back" }));
    expect(screen.getByText(/Answer a few quick/)).toBeTruthy();
  });

  it("routes returning users from the coded welcome screen to account access", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "I already have an account" }));
    expect(screen.getByText("Create an Account")).toBeTruthy();
  });

  it("opens the complete learning product with shorts, books, discovery and AI", () => {
    window.name = "imprint-inside";
    render(<App />);

    expect(screen.getByText("Why unfinished tasks stay in your head")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next short" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close short" }));
    expect(screen.getByText("Recommended for you")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: /Breath/ })[0]);
    expect(screen.getByText("What you’ll learn")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close book details" }));

    fireEvent.click(screen.getByRole("button", { name: "Explore" }));
    fireEvent.click(screen.getByRole("button", { name: /Ask Imprint AI/ }));
    fireEvent.click(screen.getByRole("button", { name: "Explain visually" }));
    expect(screen.getByText("In simple terms")).toBeTruthy();
  });

  it("opens the reference-style book detail and continues into the visual reader", () => {
    window.name = "imprint-book-detail";
    render(<App />);

    expect(screen.getByText("Breath")).toBeTruthy();
    expect(screen.getByText("What you’ll learn")).toBeTruthy();
    expect(screen.getByText("Featured in")).toBeTruthy();
    expect(screen.getByText("You may also like")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByRole("button", { name: "Close reader" })).toBeTruthy();
    expect(screen.getByText(/looked at your thumb/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText(/microbes living inside of you/)).toBeTruthy();
  });

  it("presents Shorts with the same visual-reader structure", () => {
    window.name = "imprint-shorts";
    render(<App />);

    expect(screen.getByRole("button", { name: "Close short" })).toBeTruthy();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("1");
    expect(screen.getByText("Why unfinished tasks stay in your head")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Next short" }));
    expect(screen.getByText("Your memory is rebuilt, not replayed")).toBeTruthy();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("2");

    fireEvent.click(screen.getByRole("button", { name: "Close short" }));
    expect(screen.getByText("Recommended for you")).toBeTruthy();
  });
});
