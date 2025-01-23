import { connectToDatabase } from "./connect-to-database";
import { LatestInvoiceRaw } from "./definitions";
import { formatCurrency } from "./utils";

export async function fetchRevenue() {
  const client = await connectToDatabase();
  try {
    // We artificially delay a response for demo purposes.
    // Don't do this in production :)
    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const { rows } = await client.query(`SELECT * FROM revenue`);

    console.log("Data fetch completed after 3 seconds.");

    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  } finally {
    client.release(); // Release the client back to the pool
  }
}

export async function fetchLatestInvoices() {
  const client = await connectToDatabase();
  try {
    const query = `
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5;
    `;

    const { rows } = await client.query(query); // Execute the query and get the result

    const latestInvoices = (rows as LatestInvoiceRaw[]).map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  } finally {
    client.release(); // Release the client back to the pool
  }
}

export async function fetchCardData() {
  const client = await connectToDatabase();
  try {
    // Define the queries
    const invoiceCountQuery = "SELECT COUNT(*) FROM invoices";
    const customerCountQuery = "SELECT COUNT(*) FROM customers";
    const invoiceStatusQuery = `
      SELECT
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
      FROM invoices
    `;

    // Execute the queries in parallel
    const [invoiceCountResult, customerCountResult, invoiceStatusResult] =
      await Promise.all([
        client.query(invoiceCountQuery),
        client.query(customerCountQuery),
        client.query(invoiceStatusQuery),
      ]);

    // Extract and transform the results
    const numberOfInvoices = Number(invoiceCountResult.rows[0].count ?? "0");
    const numberOfCustomers = Number(customerCountResult.rows[0].count ?? "0");
    const totalPaidInvoices = formatCurrency(
      invoiceStatusResult.rows[0].paid ?? "0"
    );
    const totalPendingInvoices = formatCurrency(
      invoiceStatusResult.rows[0].pending ?? "0"
    );

    // Return the formatted data
    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  } finally {
    client.release(); // Release the client back to the pool
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const client = await connectToDatabase();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const { rows } = await client.query(
      `
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        customers.email ILIKE $1 OR
        invoices.amount::text ILIKE $1 OR
        invoices.date::text ILIKE $1 OR
        invoices.status ILIKE $1
      ORDER BY invoices.date DESC
      LIMIT $2 OFFSET $3
    `,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );

    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  } finally {
    client.release();
  }
}

export async function fetchInvoicesPages(query: string) {
  const client = await connectToDatabase();

  try {
    const { rows } = await client.query(
      `
      SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        customers.email ILIKE $1 OR
        invoices.amount::text ILIKE $1 OR
        invoices.date::text ILIKE $1 OR
        invoices.status ILIKE $1
    `,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  } finally {
    client.release();
  }
}

export async function fetchInvoiceById(id: string) {
  const client = await connectToDatabase();

  try {
    const { rows } = await client.query(
      `
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = $1
    `,
      [id]
    );

    const invoice = rows.map((invoice) => ({
      ...invoice,
      amount: invoice.amount / 100, // Convert cents to dollars
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  } finally {
    client.release();
  }
}

export async function fetchCustomers() {
  const client = await connectToDatabase();

  try {
    const { rows } = await client.query(`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `);

    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch all customers.");
  } finally {
    client.release();
  }
}

export async function fetchFilteredCustomers(query: string) {
  const client = await connectToDatabase();

  try {
    const { rows } = await client.query(
      `
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE
        customers.name ILIKE $1 OR
        customers.email ILIKE $1
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC
    `,
      [`%${query}%`]
    );

    const customers = rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customer table.");
  } finally {
    client.release();
  }
}
