export const DEMO_SCHEMA = `
PostgreSQL schema for the Decyra demo database. All tables are in the 'demo' schema. Always prefix table names with 'demo.' in SQL queries.

TABLE demo.customers
  id (serial, primary key)
  name (text) — customer company name
  industry (text) — values are exactly one of: 'SaaS', 'FinTech', 'Healthcare', 'Retail', 'Manufacturing'
  country (text) — ISO country codes: 'US', 'UK', 'CA', 'AU', 'DE'
  signup_date (date) — when the customer signed up
  arr_band (text) — annual recurring revenue band: 'small', 'mid', 'large', 'enterprise'

TABLE demo.products
  id (serial, primary key)
  name (text) — product name
  category (text) — exactly one of: 'Subscription', 'Add-on', 'Service'
  price (numeric) — unit price in USD
  active (boolean) — whether the product is currently sold

TABLE demo.sales_reps
  id (serial, primary key)
  name (text) — sales rep full name
  region (text) — exactly one of: 'North', 'South', 'East', 'West'
  quota (numeric) — quarterly quota in USD
  start_date (date) — when the rep started at the company

TABLE demo.orders
  id (serial, primary key)
  customer_id (int) — foreign key to demo.customers.id
  product_id (int) — foreign key to demo.products.id
  sales_rep_id (int) — foreign key to demo.sales_reps.id
  quantity (int) — number of units ordered
  unit_price (numeric) — price per unit at time of order
  total (numeric) — total order value (quantity * unit_price)
  order_date (date) — when the order was placed
  status (text) — exactly one of: 'pending', 'shipped', 'delivered', 'cancelled', 'returned'

EXAMPLE QUERIES (use these as patterns for similar questions):

Q: Top 10 customers by total revenue
SQL: SELECT c.name, SUM(o.total) AS revenue FROM demo.customers c JOIN demo.orders o ON c.id = o.customer_id WHERE o.status = 'delivered' GROUP BY c.name ORDER BY revenue DESC LIMIT 10;

Q: Orders last quarter by region
SQL: SELECT sr.region, COUNT(o.id) AS order_count FROM demo.orders o JOIN demo.sales_reps sr ON o.sales_rep_id = sr.id WHERE o.order_date >= date_trunc('quarter', current_date) - interval '3 months' AND o.order_date < date_trunc('quarter', current_date) GROUP BY sr.region ORDER BY order_count DESC;

Q: Sales reps below 80% of quota this quarter
SQL: SELECT sr.name, sr.quota, COALESCE(SUM(o.total), 0) AS achieved, ROUND((COALESCE(SUM(o.total), 0) / sr.quota * 100)::numeric, 1) AS pct_to_quota FROM demo.sales_reps sr LEFT JOIN demo.orders o ON sr.id = o.sales_rep_id AND o.order_date >= date_trunc('quarter', current_date) AND o.status = 'delivered' GROUP BY sr.id, sr.name, sr.quota HAVING COALESCE(SUM(o.total), 0) < sr.quota * 0.8 ORDER BY pct_to_quota ASC;
`;
