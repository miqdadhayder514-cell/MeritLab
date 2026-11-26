"use client";

import { type FormEvent, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bars } from "./charts";
import { Button, Card, Eyebrow, Icon, Progress } from "./ui";

const initialStudents = [
  {
    name: "Areeba Khan",
    email: "areeba.k@example.com",
    category: "NET-Engineering",
    activity: "Today",
    status: "Active",
  },
  {
    name: "Hamza Ahmed",
    email: "hamza.a@example.com",
    category: "NET-Applied Sciences",
    activity: "Yesterday",
    status: "Active",
  },
  {
    name: "Zara Hussain",
    email: "zara.h@example.com",
    category: "NET-Business Studies",
    activity: "Nov 23",
    status: "Active",
  },
  {
    name: "Usman Ali",
    email: "usman.a@example.com",
    category: "NET-Engineering",
    activity: "Nov 20",
    status: "Inactive",
  },
];

function AdminHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <Eyebrow>MERITLAB ADMIN</Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function AdminOverview() {
  return (
    <>
      <AdminHeading
        title="Platform overview"
        description="A snapshot of content and platform activity. All figures below are illustrative demo data."
        action={
          <button
            type="button"
            className="button button-outline"
            onClick={() => window.location.reload()}
          >
            <Icon name="chart" size={16} /> Refresh view
          </button>
        }
      />
      <div className="admin-stat-grid">
        <div className="admin-stat">
          <span className="admin-stat-icon admin-blue">
            <Icon name="user" />
          </span>
          <small>Total students</small>
          <strong>2,486</strong>
          <em>↑ 12% this month</em>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon admin-teal">
            <Icon name="practice" />
          </span>
          <small>Question bank</small>
          <strong>4,820</strong>
          <em>Across 5 categories</em>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon admin-violet">
            <Icon name="clock" />
          </span>
          <small>Mock tests</small>
          <strong>18</strong>
          <em>6 published</em>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon admin-amber">
            <Icon name="chart" />
          </span>
          <small>Sessions this week</small>
          <strong>8,142</strong>
          <em>↑ 8% this month</em>
        </div>
      </div>
      <div className="dashboard-main-grid admin-main-grid">
        <Card>
          <div className="card-heading">
            <div>
              <h2>Student activity</h2>
              <p>Weekly practice and learning sessions</p>
            </div>
            <span className="admin-tag">DEMO DATA</span>
          </div>
          <Bars
            values={[48, 62, 56, 83, 68, 42, 28]}
            labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          />
        </Card>
        <Card>
          <div className="card-heading">
            <div>
              <h2>Content readiness</h2>
              <p>Review queue snapshot</p>
            </div>
            <a href="/admin/questions" className="subtle-link">
              Manage questions <Icon name="arrow" size={14} />
            </a>
          </div>
          <div className="content-ready-row">
            <span>
              <i className="ready-dot" /> Published questions
            </span>
            <strong>4,582</strong>
          </div>
          <Progress value={82} color="teal" />
          <div className="content-ready-row">
            <span>
              <i className="review-dot" /> Awaiting review
            </span>
            <strong>238</strong>
          </div>
          <Progress value={18} color="amber" />
          <div className="content-ready-row">
            <span>
              <i className="draft-dot" /> Draft questions
            </span>
            <strong>146</strong>
          </div>
          <Progress value={12} color="violet" />
        </Card>
      </div>
      <Card className="admin-table-card">
        <div className="card-heading">
          <div>
            <h2>Latest student activity</h2>
            <p>Illustrative student accounts · no live personal data</p>
          </div>
          <a href="/admin/students" className="button button-quiet button-small">
            All students <Icon name="arrow" size={14} />
          </a>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>NET CATEGORY</th>
                <th>LAST ACTIVE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {initialStudents.slice(0, 3).map((student) => (
                <tr key={student.email}>
                  <td>
                    <span className="table-student">
                      <i>
                        {student.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </i>
                      <span>
                        <strong>{student.name}</strong>
                        <small>{student.email}</small>
                      </span>
                    </span>
                  </td>
                  <td>{student.category}</td>
                  <td>{student.activity}</td>
                  <td>
                    <span className="status-pill status-active">
                      <i />
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function StudentsAdmin() {
  const [students, setStudents] = useState(initialStudents);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const filtered = students.filter(
    (s) =>
      `${s.name} ${s.email}`.toLowerCase().includes(query.toLowerCase()) &&
      (category === "All categories" || s.category.includes(category)),
  );
  return (
    <>
      <AdminHeading
        title="Students"
        description="Browse demonstration student profiles. Student management is not connected to a live account system."
        action={
          <button
            type="button"
            className="button button-outline"
            onClick={() => {
              const blob = new Blob(
                [
                  "Name,Email,Category,Status\n" +
                    students
                      .map((s) => `${s.name},${s.email},${s.category},${s.status}`)
                      .join("\n"),
                ],
                { type: "text/csv" },
              );
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "meritlab-demo-students.csv";
              link.click();
              URL.revokeObjectURL(link.href);
            }}
          >
            <Icon name="arrow" size={16} /> Export CSV
          </button>
        }
      />
      <div className="admin-filter-row">
        <label className="resource-search">
          <Icon name="search" size={17} />
          <input
            placeholder="Search students..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          className="filter-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All categories</option>
          <option>Engineering</option>
          <option>Applied Sciences</option>
          <option>Business</option>
        </select>
        <span className="table-total">{filtered.length} demo accounts</span>
      </div>
      <Card className="admin-table-card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>NET CATEGORY</th>
                <th>LAST ACTIVE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.email}>
                  <td>
                    <span className="table-student">
                      <i>
                        {student.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </i>
                      <span>
                        <strong>{student.name}</strong>
                        <small>{student.email}</small>
                      </span>
                    </span>
                  </td>
                  <td>{student.category}</td>
                  <td>{student.activity}</td>
                  <td>
                    <button
                      type="button"
                      className={`status-pill ${student.status === "Active" ? "status-active" : "status-inactive"}`}
                      onClick={() =>
                        setStudents(
                          students.map((s) =>
                            s.email === student.email
                              ? {
                                  ...s,
                                  status: s.status === "Active" ? "Inactive" : "Active",
                                }
                              : s,
                          ),
                        )
                      }
                    >
                      <i />
                      {student.status}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`View ${student.name}`}
                      onClick={() =>
                        alert(`Demo profile: ${student.name} · ${student.category}`)
                      }
                    >
                      <Icon name="more" size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-table">No demo students match your search.</div>
          )}
        </div>
        <div className="table-footer">
          Showing {filtered.length} of {students.length} demonstration records
        </div>
      </Card>
    </>
  );
}

function QuestionsAdmin() {
  const [items, setItems] = useState<
    {
      id: string;
      title: string;
      subject: string;
      chapter: string;
      difficulty: string;
      status: string;
    }[]
  >([]);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All subjects");
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          `${item.title} ${item.id}`.toLowerCase().includes(query.toLowerCase()) &&
          (subject === "All subjects" || item.subject === subject),
      ),
    [items, query, subject],
  );
  function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return;
    setItems([
      {
        id: `ML-${items.length + 1}`,
        title,
        subject: String(formData.get("subject")),
        chapter: String(formData.get("chapter")),
        difficulty: String(formData.get("difficulty")),
        status: "Draft",
      },
      ...items,
    ]);
    setModal(false);
    setNotice("Draft added to this local demonstration list.");
    event.currentTarget.reset();
  }
  return (
    <>
      <AdminHeading
        title="Question bank"
        description="Create and review original practice questions. This frontend demo does not persist content."
        action={
          <Button onClick={() => setModal(true)}>
            <Icon name="plus" size={16} /> Add question
          </Button>
        }
      />
      <div className="admin-question-stats">
        <span>
          <strong>{items.length}</strong>
          <small>Questions in workspace</small>
        </span>
        <span>
          <strong>{items.filter((item) => item.status === "Published").length}</strong>
          <small>Published</small>
        </span>
        <span>
          <strong>{items.filter((item) => item.status === "In review").length}</strong>
          <small>Awaiting review</small>
        </span>
        <span>
          <strong>{items.filter((item) => item.status === "Draft").length}</strong>
          <small>Drafts</small>
        </span>
      </div>
      {notice && (
        <div className="form-alert form-alert-success">
          <Icon name="check" size={16} /> {notice}{" "}
          <button type="button" onClick={() => setNotice("")}>
            Dismiss
          </button>
        </div>
      )}
      <div className="admin-filter-row">
        <label className="resource-search">
          <Icon name="search" size={17} />
          <input
            placeholder="Search questions or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          className="filter-control"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option>All subjects</option>
          {["Mathematics", "Physics", "English", "Biology"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button
          type="button"
          className="button button-outline"
          onClick={() => {
            setQuery("");
            setSubject("All subjects");
          }}
        >
          <Icon name="filter" size={16} /> Reset filters
        </button>
      </div>
      <Card className="admin-table-card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>QUESTION</th>
                <th>SUBJECT / CHAPTER</th>
                <th>DIFFICULTY</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="question-table-title">
                      <strong>{item.title}</strong>
                      <small>{item.id} · Original practice</small>
                    </span>
                  </td>
                  <td>
                    {item.subject}
                    <small className="table-subline">{item.chapter}</small>
                  </td>
                  <td>
                    <span
                      className={`difficulty-tag difficulty-${item.difficulty.toLowerCase()}`}
                    >
                      {item.difficulty}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${item.status === "Published" ? "status-active" : "status-review"}`}
                    >
                      <i />
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Edit ${item.id}`}
                      onClick={() =>
                        setNotice(`Editing for ${item.id} is represented in demo mode.`)
                      }
                    >
                      <Icon name="more" size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-table">
              {items.length === 0
                ? "No practice questions have been added yet."
                : "No questions match those filters."}
            </div>
          )}
        </div>
        <div className="table-footer">
          Showing {filtered.length} questions in this local workspace
        </div>
      </Card>
      {modal && (
        <div className="modal-backdrop">
          <form className="admin-modal" onSubmit={addQuestion}>
            <button
              type="button"
              className="modal-close icon-button"
              onClick={() => setModal(false)}
              aria-label="Close"
            >
              <Icon name="close" />
            </button>
            <Eyebrow>QUESTION AUTHORING</Eyebrow>
            <h2>Add a practice question</h2>
            <p>This creates a temporary local draft only.</p>
            <label className="field-label">
              Question statement
              <textarea
                className="form-input"
                name="title"
                rows={3}
                placeholder="Write an original practice question..."
                required
              />
            </label>
            <div className="profile-form-grid">
              <label className="field-label">
                Subject
                <select name="subject" className="form-input">
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>English</option>
                  <option>Biology</option>
                </select>
              </label>
              <label className="field-label">
                Chapter
                <input
                  name="chapter"
                  className="form-input"
                  placeholder="e.g. Algebra"
                  required
                />
              </label>
              <label className="field-label">
                Difficulty
                <select name="difficulty" className="form-input">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </label>
            </div>
            <p className="source-note modal-source-note">
              <Icon name="info" size={14} /> Identify material as original practice
              unless an authentic source has been verified.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                Save draft <Icon name="check" size={15} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

const adminSections: Record<
  string,
  { title: string; intro: string; rows: string[]; icon: string }
> = {
  subjects: {
    title: "Subjects",
    intro: "Manage subject labels used to organize category-aligned study content.",
    rows: [
      "Mathematics",
      "Physics",
      "English",
      "Biology",
      "Chemistry",
      "Quantitative Mathematics",
    ],
    icon: "book",
  },
  chapters: {
    title: "Chapters",
    intro: "Organize chapters under their subject and applicable NET categories.",
    rows: [
      "Algebra & Functions",
      "Trigonometry",
      "Calculus",
      "Waves & Oscillations",
      "Cell Biology",
      "Chemical Bonding",
    ],
    icon: "book",
  },
  resources: {
    title: "Study resources",
    intro: "Review and organize supplementary learning material.",
    rows: [
      "Waves & oscillations · Revision notes",
      "Commonly confused words · Study guide",
      "Cell biology concept map · Revision notes",
    ],
    icon: "function",
  },
  tests: {
    title: "Mock tests",
    intro:
      "Configure practice simulations separately from official NUST examination guidance.",
    rows: [
      "NET-Engineering · Full Mock 01",
      "NET-Applied Sciences · Mock 01",
      "Business Studies · Practice Mock",
      "Mathematics · Topic review",
    ],
    icon: "clock",
  },
};

function ContentManager({ section }: { section: string }) {
  const config = adminSections[section];
  const [rows, setRows] = useState(config.rows);
  const [query, setQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = rows.filter((row) =>
    row.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <AdminHeading
        title={config.title}
        description={config.intro}
        action={
          <a href="/admin/questions" className="button button-primary">
            <Icon name="plus" size={16} /> Add content
          </a>
        }
      />
      <Card className="admin-content-manager">
        <div className="content-manager-head">
          <div className={`resource-icon resource-icon-1`}>
            <Icon name={config.icon} size={21} />
          </div>
          <div>
            <h2>{config.title} library</h2>
            <p>{rows.length} local demo items · changes are not persisted</p>
          </div>
          <label className="resource-search">
            <Icon name="search" size={16} />
            <input
              placeholder={`Search ${config.title.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        {notice && (
          <div className="form-alert form-alert-success">
            <Icon name="check" size={16} /> {notice}
          </div>
        )}
        <form
          className="inline-add-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!newName.trim()) return;
            setRows([newName.trim(), ...rows]);
            setNewName("");
            setNotice(`Added “${newName.trim()}” to this local demo.`);
          }}
        >
          <input
            className="form-input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`New ${section === "tests" ? "test" : section.slice(0, -1)} name`}
            required
          />
          <button className="button button-primary button-small" type="submit">
            <Icon name="plus" size={15} /> Add
          </button>
        </form>
        <div className="admin-managed-list">
          {filtered.map((row, i) => (
            <div key={row} className="managed-row">
              <span className={`managed-row-icon managed-icon-${i % 4}`}>
                <Icon name={config.icon} size={17} />
              </span>
              <div>
                <strong>{row}</strong>
                <small>
                  {section === "resources"
                    ? "Draft resource · source review required"
                    : section === "tests"
                      ? "Practice simulation · draft"
                      : "Demo content · active"}
                </small>
              </div>
              <span className="status-pill status-review">
                <i />
                {section === "resources" ? "Draft" : "Active"}
              </span>
              <button
                type="button"
                className="icon-button"
                aria-label={`Remove ${row}`}
                onClick={() => setRows(rows.filter((item) => item !== row))}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty-table">No items found.</div>}
      </Card>
      <p className="demo-notice">
        <Icon name="info" size={14} /> These controls modify local demonstration state
        only. Production management requires authenticated admin permissions and
        database policies.
      </p>
    </>
  );
}

function AdminAnalytics() {
  return (
    <>
      <AdminHeading
        title="Platform analytics"
        description="Illustrative aggregate metrics for a future admin insights view."
        action={
          <select className="select-control">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>All time</option>
          </select>
        }
      />
      <div className="admin-stat-grid">
        <div className="admin-stat">
          <span className="admin-stat-icon admin-blue">
            <Icon name="user" />
          </span>
          <small>Monthly active learners</small>
          <strong>1,842</strong>
          <em>+12% over prior period</em>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon admin-teal">
            <Icon name="practice" />
          </span>
          <small>Practice sessions</small>
          <strong>18,506</strong>
          <em>6.2 questions per session</em>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon admin-violet">
            <Icon name="clock" />
          </span>
          <small>Mock completions</small>
          <strong>3,224</strong>
          <em>+8% over prior period</em>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon admin-amber">
            <Icon name="chart" />
          </span>
          <small>Average accuracy</small>
          <strong>68%</strong>
          <em>Across demo results</em>
        </div>
      </div>
      <Card>
        <div className="card-heading">
          <div>
            <h2>Weekly engagement</h2>
            <p>Illustrative student learning sessions</p>
          </div>
          <span className="admin-tag">DEMO</span>
        </div>
        <Bars
          values={[58, 68, 52, 92, 75, 38, 29]}
          labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        />
      </Card>
      <div className="dashboard-secondary-grid admin-breakdown">
        <Card>
          <h2>Content usage</h2>
          {[
            ["Mathematics", 82],
            ["Physics", 68],
            ["English", 62],
            ["Biology", 46],
          ].map(([name, value]) => (
            <div className="subject-performance" key={name}>
              <span>{name}</span>
              <Progress value={Number(value)} color="blue" />
              <strong>{value}%</strong>
            </div>
          ))}
        </Card>
        <Card>
          <h2>Mock completion</h2>
          <div className="completion-big">
            <strong>74%</strong>
            <p>of started mock simulations were completed in this demo overview.</p>
          </div>
          <Progress value={74} color="teal" />
        </Card>
      </div>
    </>
  );
}

function NotificationsAdmin() {
  const [publishing, setPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function publishAnnouncement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const href = String(formData.get("href") ?? "").trim() || null;

    if (
      title.length < 1 ||
      title.length > 120 ||
      body.length < 1 ||
      body.length > 500
    ) {
      setErrorMessage(
        "Enter a title (up to 120 characters) and message (up to 500 characters).",
      );
      return;
    }

    setPublishing(true);
    try {
      const { data, error } = await createClient().rpc("admin_publish_announcement", {
        p_title: title,
        p_body: body,
        p_href: href,
      });
      if (error) throw error;
      if (typeof data !== "number") {
        throw new Error("The announcement result was invalid.");
      }
      setSuccessMessage(
        `Announcement sent to ${data} ${data === 1 ? "student" : "students"}.`,
      );
      form.reset();
    } catch (error) {
      const fields =
        error !== null && typeof error === "object"
          ? (error as Record<string, unknown>)
          : {};
      console.error(
        `Could not publish announcement: ${JSON.stringify({
          code: fields.code ?? null,
          message:
            fields.message ?? (error instanceof Error ? error.message : String(error)),
        })}`,
      );
      setErrorMessage(
        "The announcement could not be published. Confirm that the notifications migration is applied and try again.",
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <>
      <AdminHeading
        title="Notifications"
        description="Send an in-app announcement to every student account."
      />
      <Card className="announcement-composer">
        <div className="card-heading">
          <div>
            <Eyebrow>STUDENT INBOX</Eyebrow>
            <h2>Publish an announcement</h2>
            <p>
              It will appear in each student’s notification bell. Announcements are
              in-app only; no email or push notification is sent.
            </p>
          </div>
          <span className="announcement-composer-icon">
            <Icon name="bell" size={20} />
          </span>
        </div>
        <form className="announcement-form" onSubmit={publishAnnouncement}>
          <label className="field-label">
            Announcement title
            <input
              className="form-input"
              name="title"
              maxLength={120}
              placeholder="For example: New NET practice material"
              required
            />
          </label>
          <label className="field-label">
            Message
            <textarea
              className="form-input announcement-message-input"
              name="body"
              maxLength={500}
              placeholder="Share a concise update with students..."
              required
            />
          </label>
          <label className="field-label">
            Optional link
            <input
              className="form-input"
              name="href"
              maxLength={500}
              placeholder="/mock-tests"
              pattern="/(?!/).*"
              title="Use a path on this website, such as /mock-tests"
            />
            <small className="announcement-field-help">
              Use an internal MeritLab page path, such as /mock-tests.
            </small>
          </label>
          {errorMessage && (
            <p className="form-alert form-alert-error" role="alert">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="form-alert form-alert-success" role="status">
              {successMessage}
            </p>
          )}
          <button type="submit" className="button button-primary" disabled={publishing}>
            <Icon name="bell" size={16} />
            {publishing ? "Publishing..." : "Send to all students"}
          </button>
        </form>
      </Card>
    </>
  );
}

export function AdminPage({ path }: { path: string[] }) {
  const section = path[1] ?? "";
  if (!section) return <AdminOverview />;
  if (section === "students") return <StudentsAdmin />;
  if (section === "notifications") return <NotificationsAdmin />;
  if (section === "questions") return <QuestionsAdmin />;
  if (section === "analytics") return <AdminAnalytics />;
  if (adminSections[section]) return <ContentManager section={section} />;
  return <AdminOverview />;
}
