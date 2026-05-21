const fs = require("fs");

const base = fs.readFileSync("1.html", "utf8");
const style = base.match(/<style>[\s\S]*?<\/style>/)[0];
const companyPageStyle = `${style}
  <style>
    .hero__title {
      font-size: clamp(32px, 4.6vw, 58px);
      line-height: 1;
      max-width: 100%;
      overflow-wrap: normal;
      word-break: normal;
    }

    .hero__title span {
      -webkit-text-stroke-width: clamp(2px, 0.3vw, 4px);
    }

    @media (min-width: 761px) {
      .hero__title {
        font-size: clamp(32px, 4.4vw, 56px);
      }
    }

    @media (max-width: 760px) {
      .hero__title {
        font-size: clamp(30px, 10vw, 52px);
        max-width: 100%;
      }
    }
  </style>`;

const companies = [
  {
    slug: "google",
    name: "Google",
    questions: [
      q("Ride Completion Rate", "Google Maps", "Calculate the completion rate of rides per city.", [["rides", [["ride_id","integer"],["user_id","integer"],["city","varchar"],["status","varchar"]], [["1","101","NYC","completed"],["2","102","NYC","cancelled"],["3","103","SF","completed"],["4","104","SF","cancelled"],["5","105","NYC","completed"],["6","106","SF","completed"],["7","107","NYC","cancelled"],["8","108","NYC","completed"]]]], ["city","completion_rate"], [["NYC","60.00"],["SF","66.67"]], `SELECT
  city,
  ROUND(100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS completion_rate
FROM rides
GROUP BY city;`, ["Count completed rides per city.", "Divide by total rides in that city.", "Use 100.0 or a decimal cast to avoid integer division."], ["Group rides by city.", "Count completed rides with a CASE expression.", "Divide completed rides by all rides and round the percentage."]),
      q("Fraud Detection", "Google Pay", "Find users who made more than 3 transactions within 1 minute.", [["transactions", [["txn_id","integer"],["user_id","integer"],["amount","decimal"],["txn_time","datetime"],["device_id","varchar"]], [["1","101","100","10:00:00","A"],["2","101","200","10:00:20","A"],["3","101","150","10:00:40","A"],["4","101","300","10:00:50","A"],["5","102","500","11:00:00","B"],["6","102","600","11:05:00","B"],["7","103","200","12:00:00","C"]]]], ["user_id"], [["101"]], `SELECT DISTINCT
  t1.user_id
FROM transactions t1
JOIN transactions t2
  ON t1.user_id = t2.user_id
 AND t2.txn_time BETWEEN t1.txn_time AND t1.txn_time + INTERVAL '1 minute'
GROUP BY t1.user_id, t1.txn_id, t1.txn_time
HAVING COUNT(*) > 3;`, ["Treat each transaction as a possible window start.", "Join later transactions within 1 minute for the same user.", "Keep windows where the count is greater than 3."], ["Self-join transactions by user.", "Limit the joined rows to a 1 minute window.", "Return users with more than 3 transactions in any such window."]),
      q("Popular Routes", "Google Maps", "Find the most frequently searched route.", [["search_routes", [["search_id","integer"],["user_id","integer"],["source","varchar"],["destination","varchar"],["search_time","date"]], [["1","101","A","B","2024-01-01"],["2","102","A","B","2024-01-01"],["3","103","B","C","2024-01-01"],["4","104","A","B","2024-01-02"],["5","105","B","C","2024-01-02"],["6","106","A","D","2024-01-02"],["7","107","A","B","2024-01-03"],["8","108","B","C","2024-01-03"],["9","109","A","B","2024-01-03"]]]], ["source","destination","count"], [["A","B","5"]], `SELECT
  source,
  destination,
  COUNT(*) AS count
FROM search_routes
GROUP BY source, destination
ORDER BY count DESC
LIMIT 1;`, ["A route is the source plus destination pair.", "Count searches per pair.", "Sort descending and keep the top row."], ["Group searches by route.", "Count each route search.", "Order by frequency and return the most searched route."]),
      q("Merchant Revenue", "Google Pay", "Find the top 2 merchants by total transaction amount.", [["transactions", [["txn_id","integer"],["merchant_id","varchar"],["amount","integer"]], [["1","M1","100"],["2","M2","200"],["3","M1","300"],["4","M3","400"],["5","M2","150"],["6","M1","250"]]]], ["merchant_id","total_amount"], [["M1","650"],["M3","400"]], `SELECT
  merchant_id,
  SUM(amount) AS total_amount
FROM transactions
GROUP BY merchant_id
ORDER BY total_amount DESC
LIMIT 2;`, ["Revenue is the sum of amount.", "Aggregate by merchant_id.", "Sort high to low and limit to 2."], ["Group transactions by merchant.", "Sum the amount for each merchant.", "Return the two highest totals."]),
      q("App Engagement", "Google Play", "Find users who opened the app on 3 consecutive days.", [["app_usage", [["user_id","integer"],["open_date","date"]], [["101","2024-01-01"],["101","2024-01-02"],["101","2024-01-03"],["102","2024-01-01"],["102","2024-01-03"],["103","2024-01-05"],["104","2024-01-06"]]]], ["user_id"], [["101"]], consecutiveSql("app_usage", "open_date", "user_id"), ["Remove duplicate open dates first.", "Use date minus row number to form streak groups.", "A 3 day streak has COUNT(*) >= 3."], ["Deduplicate user-date pairs.", "Build consecutive date groups using ROW_NUMBER.", "Keep users with a group of at least 3 days."]),
      q("Email Activity", "Gmail", "Find users who sent more than 5 emails in a single day.", [["emails", [["email_id","integer"],["sender_id","integer"],["sent_date","date"]], [["1","101","2024-01-01"],["2","101","2024-01-01"],["3","101","2024-01-01"],["4","101","2024-01-01"],["5","101","2024-01-01"],["6","101","2024-01-01"],["7","102","2024-01-02"],["8","103","2024-01-02"]]]], ["sender_id"], [["101"]], `SELECT DISTINCT
  sender_id
FROM emails
GROUP BY sender_id, sent_date
HAVING COUNT(*) > 5;`, ["Group by sender and day.", "Count emails in each sender-day group.", "Return senders whose daily count is greater than 5."], ["Create daily sender groups.", "Use COUNT(*) for emails sent.", "Keep only groups above 5 emails."]),
      q("Browser Session Time", "Google Chrome", "Find total browsing time per user.", [["browser_sessions", [["session_id","integer"],["user_id","integer"],["duration_minutes","integer"]], [["1","101","60"],["2","101","90"],["3","102","45"],["4","103","80"],["5","101","30"]]]], ["user_id","total_time"], [["101","180"],["102","45"],["103","80"]], `SELECT
  user_id,
  SUM(duration_minutes) AS total_time
FROM browser_sessions
GROUP BY user_id;`, ["Total time is a SUM.", "Aggregate by user_id.", "Alias the result as total_time."], ["Group sessions by user.", "Add all duration_minutes.", "Return one row per user."]),
      q("Trending Search Terms", "Google Search", "Find queries whose frequency increased compared to the previous day.", [["search_logs", [["query","varchar"],["search_date","date"]], [["AI","2024-01-01"],["AI","2024-01-02"],["AI","2024-01-02"],["SQL","2024-01-01"],["SQL","2024-01-02"],["Python","2024-01-02"],["Python","2024-01-02"]]]], ["query"], [["AI"]], trendingSql("search_logs", "query", "search_date"), ["Count searches per query per day.", "Use LAG to fetch the previous day's frequency.", "Return queries where today's count is larger."], ["Aggregate daily frequencies.", "Compare each day with LAG.", "Select queries with an increase over the previous day."]),
      q("Storage Usage", "Google Drive", "Find users who exceeded 15GB storage.", [["files", [["file_id","integer"],["user_id","integer"],["size_mb","integer"]], [["1","101","5000"],["2","101","6000"],["3","101","7000"],["4","102","3000"],["5","102","2000"],["6","103","16000"],["7","104","2000"]]]], ["user_id"], [["101"],["103"]], `SELECT
  user_id
FROM files
GROUP BY user_id
HAVING SUM(size_mb) > 15360;`, ["15GB equals 15360MB if 1GB is 1024MB.", "Sum size_mb by user.", "Filter users above the threshold."], ["Group files by user.", "Sum storage in MB.", "Keep users whose total exceeds 15360 MB."]),
      q("Photo Upload Activity", "Google Photos", "Find users who uploaded photos on 3 consecutive days.", [["photo_uploads", [["upload_id","integer"],["user_id","integer"],["upload_date","date"]], [["1","101","2024-01-01"],["2","101","2024-01-02"],["3","101","2024-01-03"],["4","102","2024-01-01"],["5","102","2024-01-03"],["6","103","2024-01-05"],["7","104","2024-01-06"],["8","104","2024-01-07"]]]], ["user_id"], [["101"]], consecutiveSql("photo_uploads", "upload_date", "user_id"), ["Work with distinct upload dates per user.", "Create streak groups with ROW_NUMBER.", "Require a group length of at least 3."], ["Deduplicate user upload dates.", "Normalize consecutive dates into the same group.", "Return users with a 3 day upload streak."])
    ]
  },
  {
    slug: "uber",
    name: "Uber",
    questions: [
      q("Trip Completion Rate", "Uber", "Calculate the trip completion rate per city.", [["trips", [["trip_id","integer"],["driver_id","integer"],["rider_id","integer"],["city","varchar"],["status","varchar"]], [["1","201","101","NYC","completed"],["2","202","102","NYC","cancelled"],["3","203","103","SF","completed"],["4","204","104","SF","completed"],["5","205","105","NYC","completed"],["6","206","106","SF","cancelled"],["7","207","107","NYC","completed"],["8","208","108","NYC","cancelled"]]]], ["city","completion_rate"], [["NYC","60.00"],["SF","66.67"]], `SELECT city, ROUND(100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS completion_rate
FROM trips
GROUP BY city;`),
      q("Surge Pricing Detection", "Uber", "Find time periods where average fare increased by more than 50% compared to the previous hour.", [["trips", [["trip_id","integer"],["city","varchar"],["fare","decimal"],["request_time","datetime"]], [["1","NYC","10","09:00"],["2","NYC","12","09:30"],["3","NYC","25","10:00"],["4","NYC","30","10:30"],["5","NYC","20","11:00"],["6","NYC","22","11:30"]]]], ["hour","avg_fare"], [["10:00","27.50"]], `WITH hourly AS (
  SELECT DATE_TRUNC('hour', request_time) AS hour, AVG(fare) AS avg_fare
  FROM trips
  GROUP BY DATE_TRUNC('hour', request_time)
)
SELECT hour, avg_fare
FROM (
  SELECT hour, avg_fare, LAG(avg_fare) OVER (ORDER BY hour) AS prev_avg_fare
  FROM hourly
) h
WHERE avg_fare > prev_avg_fare * 1.5;`),
      q("Driver Utilization Rate", "Uber", "Calculate utilization rate = total trip time / total available time per driver.", [["driver_activity", [["driver_id","integer"],["trip_duration","integer"],["available_duration","integer"]], [["201","300","600"],["202","200","500"],["203","400","800"],["204","100","400"],["205","350","700"]]]], ["driver_id","utilization_rate"], [["201","0.50"],["202","0.40"],["203","0.50"],["204","0.25"],["205","0.50"]], `SELECT driver_id, ROUND(1.0 * SUM(trip_duration) / SUM(available_duration), 2) AS utilization_rate
FROM driver_activity
GROUP BY driver_id;`),
      q("Frequent Riders", "Uber", "Find riders who completed more than 3 trips in a single day.", [["trips", [["trip_id","integer"],["rider_id","integer"],["trip_date","date"]], [["1","101","2024-01-01"],["2","101","2024-01-01"],["3","101","2024-01-01"],["4","101","2024-01-01"],["5","102","2024-01-01"],["6","102","2024-01-02"]]]], ["rider_id"], [["101"]], `SELECT DISTINCT rider_id
FROM trips
GROUP BY rider_id, trip_date
HAVING COUNT(*) > 3;`),
      q("Driver Earnings Ranking", "Uber", "Rank drivers by total earnings within each city.", [["trips", [["trip_id","integer"],["driver_id","integer"],["city","varchar"],["fare","decimal"]], [["1","201","NYC","20"],["2","202","NYC","30"],["3","201","NYC","25"],["4","203","SF","40"],["5","204","SF","35"],["6","203","SF","20"]]]], ["driver_id","city","rank"], [["201","NYC","1"],["202","NYC","2"],["203","SF","1"],["204","SF","2"]], `WITH earnings AS (
  SELECT driver_id, city, SUM(fare) AS total_earnings
  FROM trips
  GROUP BY driver_id, city
)
SELECT driver_id, city, RANK() OVER (PARTITION BY city ORDER BY total_earnings DESC) AS rank
FROM earnings;`),
      q("Cancellation Rate by Rider", "Uber", "Find riders with cancellation rate greater than 50%.", [["trips", [["trip_id","integer"],["rider_id","integer"],["status","varchar"]], [["1","101","completed"],["2","101","cancelled"],["3","101","cancelled"],["4","102","completed"],["5","102","cancelled"],["6","103","cancelled"]]]], ["rider_id"], [["101"],["103"]], `SELECT rider_id
FROM trips
GROUP BY rider_id
HAVING 1.0 * SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*) > 0.5;`),
      q("Most Popular Pickup Location", "Uber", "Find the most common pickup location.", [["trips", [["trip_id","integer"],["pickup_location","varchar"]], [["1","A"],["2","B"],["3","A"],["4","C"],["5","A"],["6","B"],["7","A"]]]], ["pickup_location","trips"], [["A","4"]], `SELECT pickup_location, COUNT(*) AS trips
FROM trips
GROUP BY pickup_location
ORDER BY trips DESC
LIMIT 1;`),
      q("Trip Distance Bucketing", "Uber", "Categorize trips into short (<5km), medium (5-15km), long (>15km) and count them.", [["trips", [["trip_id","integer"],["distance_km","decimal"]], [["1","2"],["2","6"],["3","12"],["4","20"],["5","4"],["6","15"],["7","18"]]]], ["category","trip_count"], [["short","2"],["medium","3"],["long","2"]], `SELECT
  CASE
    WHEN distance_km < 5 THEN 'short'
    WHEN distance_km <= 15 THEN 'medium'
    ELSE 'long'
  END AS category,
  COUNT(*) AS trip_count
FROM trips
GROUP BY category;`),
      q("Driver Retention", "Uber", "Find drivers who completed trips in both January and February.", [["trips", [["driver_id","integer"],["trip_date","date"]], [["201","2024-01-01"],["201","2024-02-01"],["202","2024-01-05"],["203","2024-02-10"],["204","2024-01-15"],["204","2024-02-20"]]]], ["driver_id"], [["201"],["204"]], bothMonthsSql("driver_id", "trips", "trip_date")),
      q("Average ETA by City", "Uber", "Calculate average ETA per city.", [["trips", [["trip_id","integer"],["city","varchar"],["eta_minutes","integer"]], [["1","NYC","5"],["2","NYC","7"],["3","SF","10"],["4","SF","12"],["5","NYC","6"],["6","SF","8"]]]], ["city","avg_eta"], [["NYC","6.00"],["SF","10.00"]], `SELECT city, ROUND(AVG(eta_minutes), 2) AS avg_eta
FROM trips
GROUP BY city;`)
    ]
  },
  {
    slug: "airbnb",
    name: "Airbnb",
    questions: [
      q("Listing Occupancy Rate", "Airbnb", "Calculate occupancy rate = booked days / total available days for each listing.", [["bookings", [["booking_id","integer"],["listing_id","integer"],["check_in","date"],["check_out","date"]], [["1","101","2024-01-01","2024-01-03"],["2","101","2024-01-05","2024-01-07"],["3","102","2024-01-02","2024-01-04"]]],["calendar", [["listing_id","integer"],["date","date"],["is_available","boolean"]], [["101","2024-01-01","false"],["101","2024-01-02","false"],["101","2024-01-03","true"],["101","2024-01-04","true"],["101","2024-01-05","false"],["102","2024-01-02","false"],["102","2024-01-03","false"]]]], ["listing_id","occupancy_rate"], [["101","0.60"],["102","1.00"]], `SELECT listing_id, ROUND(1.0 * SUM(CASE WHEN is_available = false THEN 1 ELSE 0 END) / COUNT(*), 2) AS occupancy_rate
FROM calendar
GROUP BY listing_id;`),
      q("Top Earning Hosts", "Airbnb", "Find the top 3 hosts based on total revenue.", [["bookings", [["booking_id","integer"],["host_id","integer"],["listing_id","integer"],["total_price","decimal"]], [["1","201","101","200"],["2","202","102","300"],["3","201","103","150"],["4","203","104","400"],["5","202","105","250"],["6","201","101","350"],["7","204","106","100"]]]], ["host_id","total_revenue"], [["201","700"],["202","550"],["203","400"]], topSumSql("host_id", "total_price", "bookings", "total_revenue", 3)),
      q("Frequent Guests", "Airbnb", "Find guests who made more than 2 bookings in a month.", [["bookings", [["booking_id","integer"],["guest_id","integer"],["booking_date","date"]], [["1","101","2024-01-01"],["2","101","2024-01-05"],["3","101","2024-01-10"],["4","102","2024-01-03"],["5","102","2024-02-01"],["6","103","2024-01-15"]]]], ["guest_id"], [["101"]], `SELECT DISTINCT guest_id
FROM bookings
GROUP BY guest_id, DATE_TRUNC('month', booking_date)
HAVING COUNT(*) > 2;`),
      q("Average Review Score per Listing", "Airbnb", "Find the average review score per listing.", [["reviews", [["review_id","integer"],["listing_id","integer"],["rating","integer"]], [["1","101","5"],["2","101","4"],["3","102","3"],["4","102","4"],["5","103","5"],["6","103","5"]]]], ["listing_id","avg_rating"], [["101","4.50"],["102","3.50"],["103","5.00"]], avgSql("listing_id", "rating", "reviews", "avg_rating")),
      q("Listings with No Bookings", "Airbnb", "Find listings that have never been booked.", [["listings", [["listing_id","integer"],["host_id","integer"],["city","varchar"]], [["101","201","NYC"],["102","202","SF"],["103","203","LA"],["104","204","NYC"]]],["bookings", [["listing_id","integer"],["booking_id","integer"]], [["101","1"],["102","2"],["101","3"]]]], ["listing_id"], [["103"],["104"]], `SELECT l.listing_id
FROM listings l
LEFT JOIN bookings b
  ON l.listing_id = b.listing_id
WHERE b.booking_id IS NULL;`),
      q("Host Activity Consistency", "Airbnb", "Find hosts who had bookings in 3 consecutive months.", [["bookings", [["host_id","integer"],["booking_date","date"]], [["201","2024-01-01"],["201","2024-02-01"],["201","2024-03-01"],["202","2024-01-01"],["202","2024-03-01"],["203","2024-02-01"]]]], ["host_id"], [["201"]], consecutiveMonthSql("bookings", "host_id", "booking_date", 3)),
      q("Price per Night Analysis", "Airbnb", "Calculate average price per night per city.", [["listings", [["listing_id","integer"],["city","varchar"],["price_per_night","decimal"]], [["101","NYC","100"],["102","NYC","150"],["103","SF","200"],["104","SF","250"],["105","NYC","120"]]]], ["city","avg_price"], [["NYC","123.33"],["SF","225.00"]], avgSql("city", "price_per_night", "listings", "avg_price")),
      q("Guest Retention", "Airbnb", "Find guests who made bookings in both January and February.", [["bookings", [["guest_id","integer"],["booking_date","date"]], [["101","2024-01-01"],["101","2024-02-01"],["102","2024-01-05"],["103","2024-02-10"],["104","2024-01-15"],["104","2024-02-20"]]]], ["guest_id"], [["101"],["104"]], bothMonthsSql("guest_id", "bookings", "booking_date")),
      q("Most Booked City", "Airbnb", "Find the city with the highest number of bookings.", [["bookings", [["booking_id","integer"],["city","varchar"]], [["1","NYC"],["2","SF"],["3","NYC"],["4","LA"],["5","NYC"],["6","SF"],["7","NYC"]]]], ["city","total_bookings"], [["NYC","4"]], topCountSql("city", "bookings", "total_bookings", 1)),
      q("Long Stay Detection", "Airbnb", "Find bookings where the stay duration is more than 5 days.", [["bookings", [["booking_id","integer"],["guest_id","integer"],["check_in","date"],["check_out","date"]], [["1","101","2024-01-01","2024-01-03"],["2","102","2024-01-01","2024-01-10"],["3","103","2024-01-05","2024-01-07"],["4","104","2024-01-02","2024-01-09"],["5","105","2024-01-03","2024-01-04"]]]], ["booking_id"], [["2"],["4"]], `SELECT booking_id
FROM bookings
WHERE check_out - check_in > 5;`)
    ]
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    questions: [
      q("License Utilization Rate", "Microsoft", "Calculate the percentage of assigned licenses that are actively used.", [["licenses", [["license_id","integer"],["user_id","integer"],["assigned_date","date"],["status","varchar"]], [["1","101","2024-01-01","active"],["2","102","2024-01-02","active"],["3","103","2024-01-03","inactive"],["4","104","2024-01-04","active"],["5","105","2024-01-05","active"]]],["usage_logs", [["user_id","integer"],["last_active_date","date"]], [["101","2024-02-01"],["102","2024-02-10"],["104","2024-01-15"]]]], ["utilization_rate"], [["75.00"]], `SELECT ROUND(100.0 * COUNT(u.user_id) / COUNT(l.license_id), 2) AS utilization_rate
FROM licenses l
LEFT JOIN usage_logs u ON l.user_id = u.user_id
WHERE l.status = 'active';`),
      q("Product Adoption Trend", "Microsoft", "Find monthly active users for each product.", [["product_usage", [["user_id","integer"],["product_name","varchar"],["usage_date","date"]], [["101","Teams","2024-01-01"],["102","Teams","2024-01-02"],["103","Outlook","2024-01-03"],["101","Teams","2024-02-01"],["104","Outlook","2024-02-02"],["105","Teams","2024-02-03"]]]], ["month","product_name","active_users"], [["2024-01","Outlook","1"],["2024-01","Teams","2"],["2024-02","Outlook","1"],["2024-02","Teams","2"]], `SELECT TO_CHAR(DATE_TRUNC('month', usage_date), 'YYYY-MM') AS month, product_name, COUNT(DISTINCT user_id) AS active_users
FROM product_usage
GROUP BY DATE_TRUNC('month', usage_date), product_name;`),
      q("Teams Collaboration Activity", "Microsoft", "Find teams with more than 5 messages sent in a day.", [["messages", [["message_id","integer"],["team_id","varchar"],["user_id","integer"],["sent_date","date"]], [["1","T1","101","2024-01-01"],["2","T1","102","2024-01-01"],["3","T1","103","2024-01-01"],["4","T1","104","2024-01-01"],["5","T1","105","2024-01-01"],["6","T1","106","2024-01-01"],["7","T2","101","2024-01-01"]]]], ["team_id"], [["T1"]], `SELECT DISTINCT team_id
FROM messages
GROUP BY team_id, sent_date
HAVING COUNT(*) > 5;`),
      q("Support Ticket Resolution Time", "Microsoft", "Calculate average resolution time per support category.", [["tickets", [["ticket_id","integer"],["category","varchar"],["created_at","datetime"],["resolved_at","datetime"]], [["1","Billing","09:00","10:00"],["2","Tech","10:00","12:00"],["3","Billing","11:00","12:00"],["4","Tech","13:00","15:00"],["5","Account","14:00","16:00"]]]], ["category","avg_resolution_time"], [["Account","2 hours"],["Billing","1 hour"],["Tech","2 hours"]], `SELECT category, AVG(resolved_at - created_at) AS avg_resolution_time
FROM tickets
GROUP BY category;`),
      q("Cloud Resource Usage", "Microsoft Azure", "Find the top 3 users consuming the most compute hours.", [["cloud_usage", [["usage_id","integer"],["user_id","integer"],["resource_type","varchar"],["compute_hours","decimal"]], [["1","101","VM","20"],["2","102","VM","30"],["3","101","Storage","10"],["4","103","VM","50"],["5","104","VM","40"],["6","101","VM","25"]]]], ["user_id","total_compute_hours"], [["101","55"],["103","50"],["104","40"]], topSumSql("user_id", "compute_hours", "cloud_usage", "total_compute_hours", 3)),
      q("License Expiry Alert", "Microsoft", "Find licenses expiring within the next 7 days.", [["licenses", [["license_id","integer"],["user_id","integer"],["expiry_date","date"]], [["1","101","2024-02-01"],["2","102","2024-02-05"],["3","103","2024-02-20"],["4","104","2024-02-03"],["5","105","2024-02-10"]]]], ["license_id","user_id"], [["1","101"],["2","102"],["4","104"]], `SELECT license_id, user_id
FROM licenses
WHERE expiry_date BETWEEN DATE '2024-02-01' AND DATE '2024-02-01' + INTERVAL '7 days';`),
      q("Multi-Product Users", "Microsoft", "Find users who used more than 2 different products.", [["product_usage", [["user_id","integer"],["product_name","varchar"]], [["101","Teams"],["101","Outlook"],["101","Azure"],["102","Teams"],["102","Outlook"],["103","Azure"]]]], ["user_id"], [["101"]], `SELECT user_id
FROM product_usage
GROUP BY user_id
HAVING COUNT(DISTINCT product_name) > 2;`),
      q("Daily Active Users", "Microsoft Enterprise Apps", "Find daily active users across all products.", [["activity_logs", [["user_id","integer"],["activity_date","date"],["product_name","varchar"]], [["101","2024-01-01","Teams"],["102","2024-01-01","Outlook"],["101","2024-01-02","Azure"],["103","2024-01-02","Teams"],["104","2024-01-03","Outlook"]]]], ["activity_date","active_users"], [["2024-01-01","2"],["2024-01-02","2"],["2024-01-03","1"]], `SELECT activity_date, COUNT(DISTINCT user_id) AS active_users
FROM activity_logs
GROUP BY activity_date;`),
      q("Team Member Growth", "Microsoft Teams", "Find teams that added more than 2 members in a month.", [["team_members", [["team_id","varchar"],["user_id","integer"],["join_date","date"]], [["T1","101","2024-01-01"],["T1","102","2024-01-02"],["T1","103","2024-01-03"],["T2","104","2024-01-01"],["T2","105","2024-02-01"]]]], ["team_id"], [["T1"]], `SELECT team_id
FROM team_members
GROUP BY team_id, DATE_TRUNC('month', join_date)
HAVING COUNT(*) > 2;`),
      q("Storage Usage by Subscription", "Microsoft", "Calculate total storage used per subscription plan.", [["storage", [["user_id","integer"],["plan_type","varchar"],["storage_used_gb","decimal"]], [["101","Free","5"],["102","Premium","50"],["103","Premium","30"],["104","Free","10"],["105","Enterprise","100"],["106","Enterprise","150"]]]], ["plan_type","total_storage"], [["Enterprise","250"],["Free","15"],["Premium","80"]], `SELECT plan_type, SUM(storage_used_gb) AS total_storage
FROM storage
GROUP BY plan_type;`)
    ]
  },
  {
    slug: "spotify",
    name: "Spotify",
    questions: [
      q("Most Streamed Songs", "Spotify", "Find the top 3 most streamed songs.", [["streams", [["stream_id","integer"],["user_id","integer"],["song_id","integer"]], [["1","101","1"],["2","102","1"],["3","103","2"],["4","104","1"],["5","105","3"],["6","106","2"],["7","107","1"],["8","108","3"],["9","109","2"]]]], ["song_id","stream_count"], [["1","4"],["2","3"],["3","2"]], topCountSql("song_id", "streams", "stream_count", 3)),
      q("Artist Popularity", "Spotify", "Find the artist with the highest total streams.", [["songs", [["song_id","integer"],["artist_id","varchar"]], [["1","A1"],["2","A2"],["3","A1"],["4","A3"]]],["streams", [["stream_id","integer"],["song_id","integer"]], [["1","1"],["2","1"],["3","2"],["4","3"],["5","3"],["6","3"],["7","4"]]]], ["artist_id","total_streams"], [["A1","5"]], `SELECT s.artist_id, COUNT(*) AS total_streams
FROM streams st
JOIN songs s ON st.song_id = s.song_id
GROUP BY s.artist_id
ORDER BY total_streams DESC
LIMIT 1;`),
      q("User Listening Time", "Spotify", "Calculate total listening time per user.", [["streams", [["user_id","integer"],["song_id","integer"],["duration_seconds","integer"]], [["101","1","200"],["101","2","180"],["102","1","220"],["103","3","300"],["101","3","250"]]]], ["user_id","total_time"], [["101","630"],["102","220"],["103","300"]], `SELECT user_id, SUM(duration_seconds) AS total_time
FROM streams
GROUP BY user_id;`),
      q("Playlist Engagement", "Spotify", "Find playlists with more than 5 songs.", [["playlist_songs", [["playlist_id","integer"],["song_id","integer"]], [["1","101"],["1","102"],["1","103"],["1","104"],["1","105"],["1","106"],["2","201"],["2","202"]]]], ["playlist_id"], [["1"]], `SELECT playlist_id
FROM playlist_songs
GROUP BY playlist_id
HAVING COUNT(*) > 5;`),
      q("Premium vs Free Users", "Spotify", "Calculate average listening time for premium vs free users.", [["users", [["user_id","integer"],["subscription_type","varchar"]], [["101","Premium"],["102","Free"],["103","Premium"],["104","Free"]]],["streams", [["user_id","integer"],["duration_seconds","integer"]], [["101","200"],["101","300"],["102","100"],["103","400"],["104","150"],["103","200"]]]], ["subscription_type","avg_time"], [["Free","125.00"],["Premium","550.00"]], `WITH user_time AS (
  SELECT user_id, SUM(duration_seconds) AS total_time
  FROM streams
  GROUP BY user_id
)
SELECT u.subscription_type, ROUND(AVG(ut.total_time), 2) AS avg_time
FROM users u
JOIN user_time ut ON u.user_id = ut.user_id
GROUP BY u.subscription_type;`),
      q("Daily Active Listeners", "Spotify", "Find number of active listeners per day.", [["streams", [["user_id","integer"],["stream_date","date"]], [["101","2024-01-01"],["102","2024-01-01"],["101","2024-01-02"],["103","2024-01-02"],["104","2024-01-03"],["105","2024-01-03"],["106","2024-01-03"]]]], ["stream_date","active_users"], [["2024-01-01","2"],["2024-01-02","2"],["2024-01-03","3"]], `SELECT stream_date, COUNT(DISTINCT user_id) AS active_users
FROM streams
GROUP BY stream_date;`),
      q("Repeat Listeners", "Spotify", "Find users who listened to the same song more than once.", [["streams", [["user_id","integer"],["song_id","integer"]], [["101","1"],["101","1"],["101","2"],["102","3"],["102","3"],["103","4"]]]], ["user_id","song_id"], [["101","1"],["102","3"]], `SELECT user_id, song_id
FROM streams
GROUP BY user_id, song_id
HAVING COUNT(*) > 1;`),
      q("Trending Songs", "Spotify", "Find songs whose streams increased compared to the previous day.", [["streams", [["song_id","integer"],["stream_date","date"]], [["1","2024-01-01"],["1","2024-01-02"],["1","2024-01-02"],["2","2024-01-01"],["2","2024-01-02"],["3","2024-01-02"],["3","2024-01-02"]]]], ["song_id"], [["1"]], trendingSql("streams", "song_id", "stream_date")),
      q("Subscription Retention", "Spotify", "Find users who remained subscribed for at least 2 consecutive months.", [["subscriptions", [["user_id","integer"],["subscription_month","date"]], [["101","2024-01-01"],["101","2024-02-01"],["102","2024-01-01"],["103","2024-02-01"],["104","2024-01-01"],["104","2024-02-01"]]]], ["user_id"], [["101"],["104"]], consecutiveMonthSql("subscriptions", "user_id", "subscription_month", 2)),
      q("Long Listening Sessions", "Spotify", "Find sessions where total listening time exceeds 1 hour.", [["sessions", [["session_id","integer"],["user_id","integer"],["total_duration_seconds","integer"]], [["1","101","1800"],["2","102","4000"],["3","103","2000"],["4","104","5000"],["5","105","1000"]]]], ["session_id"], [["2"],["4"]], `SELECT session_id
FROM sessions
WHERE total_duration_seconds > 3600;`)
    ]
  },
  {
    slug: "meta",
    name: "Meta",
    questions: [
      q("Post Engagement Rate", "Meta", "Calculate engagement count per post.", [["posts", [["post_id","integer"],["user_id","integer"],["created_at","date"]], [["1","101","2024-01-01"],["2","102","2024-01-02"],["3","103","2024-01-03"]]],["reactions", [["reaction_id","integer"],["post_id","integer"],["reaction_type","varchar"]], [["1","1","like"],["2","1","comment"],["3","1","share"],["4","2","like"],["5","2","like"],["6","3","comment"],["7","3","share"]]]], ["post_id","engagement_count"], [["1","3"],["2","2"],["3","2"]], `SELECT p.post_id, COUNT(r.reaction_id) AS engagement_count
FROM posts p
LEFT JOIN reactions r ON p.post_id = r.post_id
GROUP BY p.post_id;`),
      q("Active Friends Count", "Meta", "Find users who have more than 3 friends.", [["friends", [["user_id","integer"],["friend_id","integer"]], [["101","102"],["101","103"],["101","104"],["101","105"],["102","101"],["102","103"],["103","101"]]]], ["user_id"], [["101"]], `SELECT user_id
FROM friends
GROUP BY user_id
HAVING COUNT(DISTINCT friend_id) > 3;`),
      q("Feed Ranking", "Meta", "Rank posts in a user's feed based on total engagement.", [["posts", [["post_id","integer"],["user_id","integer"]], [["1","101"],["2","102"],["3","103"]]],["reactions", [["post_id","integer"],["reaction_type","varchar"]], [["1","like"],["1","comment"],["2","like"],["2","like"],["3","like"]]]], ["post_id","rank"], [["1","1"],["2","2"],["3","3"]], `WITH engagement AS (
  SELECT p.post_id, COUNT(r.reaction_type) AS total_engagement
  FROM posts p
  LEFT JOIN reactions r ON p.post_id = r.post_id
  GROUP BY p.post_id
)
SELECT post_id, RANK() OVER (ORDER BY total_engagement DESC) AS rank
FROM engagement;`),
      q("Ad Click-Through Rate", "Meta", "Calculate CTR per ad.", [["ads", [["ad_id","integer"],["impressions","integer"],["clicks","integer"]], [["1","1000","100"],["2","2000","150"],["3","1500","300"]]]], ["ad_id","ctr"], [["1","0.1000"],["2","0.0750"],["3","0.2000"]], `SELECT ad_id, 1.0 * clicks / impressions AS ctr
FROM ads;`),
      q("Most Engaged User", "Meta", "Find the user who generated the highest total engagement.", [["posts", [["post_id","integer"],["user_id","integer"]], [["1","101"],["2","102"],["3","101"]]],["reactions", [["post_id","integer"],["reaction_id","integer"]], [["1","1"],["1","2"],["2","3"],["3","4"],["3","5"],["3","6"]]]], ["user_id","total_engagement"], [["101","5"]], `SELECT p.user_id, COUNT(r.reaction_id) AS total_engagement
FROM posts p
JOIN reactions r ON p.post_id = r.post_id
GROUP BY p.user_id
ORDER BY total_engagement DESC
LIMIT 1;`),
      q("Consecutive Login Days", "Meta", "Find users who logged in for 3 consecutive days.", [["logins", [["user_id","integer"],["login_date","date"]], [["101","2024-01-01"],["101","2024-01-02"],["101","2024-01-03"],["102","2024-01-01"],["102","2024-01-03"],["103","2024-01-05"],["104","2024-01-06"]]]], ["user_id"], [["101"]], consecutiveSql("logins", "login_date", "user_id")),
      q("Viral Posts", "Meta", "Find posts with more than 5 reactions.", [["reactions", [["reaction_id","integer"],["post_id","integer"]], [["1","1"],["2","1"],["3","1"],["4","1"],["5","1"],["6","1"],["7","2"],["8","2"]]]], ["post_id"], [["1"]], `SELECT post_id
FROM reactions
GROUP BY post_id
HAVING COUNT(*) > 5;`),
      q("Ad Revenue by Campaign", "Meta", "Calculate total revenue per ad campaign.", [["ads", [["ad_id","integer"],["campaign_id","varchar"],["revenue","decimal"]], [["1","C1","100"],["2","C1","200"],["3","C2","300"],["4","C2","150"],["5","C3","400"]]]], ["campaign_id","total_revenue"], [["C1","300"],["C2","450"],["C3","400"]], `SELECT campaign_id, SUM(revenue) AS total_revenue
FROM ads
GROUP BY campaign_id;`),
      q("New vs Returning Users", "Meta", "Classify users as new or returning based on activity.", [["activity", [["user_id","integer"],["activity_date","date"]], [["101","2024-01-01"],["101","2024-01-02"],["102","2024-01-01"],["103","2024-01-02"],["104","2024-01-03"]]]], ["user_id","user_type"], [["101","returning"],["102","new"],["103","new"],["104","new"]], `SELECT user_id,
  CASE WHEN COUNT(DISTINCT activity_date) > 1 THEN 'returning' ELSE 'new' END AS user_type
FROM activity
GROUP BY user_id;`),
      q("Most Popular Content Type", "Meta", "Find the most popular content type based on reactions.", [["posts", [["post_id","integer"],["content_type","varchar"]], [["1","video"],["2","image"],["3","video"],["4","text"]]],["reactions", [["post_id","integer"]], [["1"],["1"],["2"],["3"],["3"],["3"],["4"]]]], ["content_type","total_reactions"], [["video","5"]], `SELECT p.content_type, COUNT(*) AS total_reactions
FROM reactions r
JOIN posts p ON r.post_id = p.post_id
GROUP BY p.content_type
ORDER BY total_reactions DESC
LIMIT 1;`)
    ]
  }
];

function q(title, product, prompt, tables, outputColumns, outputRows, solution, hints, steps) {
  return {
    title,
    product,
    prompt,
    tables,
    outputColumns,
    outputRows,
    solution,
    hints: hints || ["Identify the grouping level required by the output.", "Aggregate with COUNT, SUM, AVG, or a window function as needed.", "Filter after aggregation with HAVING or after ranking with an outer query."],
    steps: steps || ["Read the expected output columns to determine the final grain.", "Aggregate or rank the input rows to calculate the requested metric.", "Filter, sort, and alias the final columns to match the output."]
  };
}

function consecutiveSql(table, dateCol, userCol) {
  return `WITH distinct_days AS (
  SELECT DISTINCT ${userCol}, ${dateCol}
  FROM ${table}
),
streaks AS (
  SELECT
    ${userCol},
    ${dateCol} - ROW_NUMBER() OVER (PARTITION BY ${userCol} ORDER BY ${dateCol})::int AS streak_group
  FROM distinct_days
)
SELECT ${userCol}
FROM streaks
GROUP BY ${userCol}, streak_group
HAVING COUNT(*) >= 3;`;
}

function trendingSql(table, entityCol, dateCol) {
  return `WITH daily_counts AS (
  SELECT ${entityCol}, ${dateCol}, COUNT(*) AS frequency
  FROM ${table}
  GROUP BY ${entityCol}, ${dateCol}
),
with_previous AS (
  SELECT
    ${entityCol},
    ${dateCol},
    frequency,
    LAG(frequency) OVER (PARTITION BY ${entityCol} ORDER BY ${dateCol}) AS previous_frequency
  FROM daily_counts
)
SELECT DISTINCT ${entityCol}
FROM with_previous
WHERE frequency > previous_frequency;`;
}

function bothMonthsSql(idCol, table, dateCol) {
  return `SELECT ${idCol}
FROM ${table}
WHERE ${dateCol} >= DATE '2024-01-01'
  AND ${dateCol} < DATE '2024-03-01'
GROUP BY ${idCol}
HAVING COUNT(DISTINCT DATE_TRUNC('month', ${dateCol})) = 2;`;
}

function consecutiveMonthSql(table, idCol, dateCol, minMonths) {
  return `WITH months AS (
  SELECT DISTINCT ${idCol}, DATE_TRUNC('month', ${dateCol}) AS month
  FROM ${table}
),
streaks AS (
  SELECT
    ${idCol},
    month - (ROW_NUMBER() OVER (PARTITION BY ${idCol} ORDER BY month) * INTERVAL '1 month') AS streak_group
  FROM months
)
SELECT ${idCol}
FROM streaks
GROUP BY ${idCol}, streak_group
HAVING COUNT(*) >= ${minMonths};`;
}

function topSumSql(idCol, valueCol, table, alias, limit) {
  return `SELECT ${idCol}, SUM(${valueCol}) AS ${alias}
FROM ${table}
GROUP BY ${idCol}
ORDER BY ${alias} DESC
LIMIT ${limit};`;
}

function topCountSql(idCol, table, alias, limit) {
  return `SELECT ${idCol}, COUNT(*) AS ${alias}
FROM ${table}
GROUP BY ${idCol}
ORDER BY ${alias} DESC
LIMIT ${limit};`;
}

function avgSql(idCol, valueCol, table, alias) {
  return `SELECT ${idCol}, ROUND(AVG(${valueCol}), 2) AS ${alias}
FROM ${table}
GROUP BY ${idCol};`;
}

function buildHeroTitle(title) {
  const smallWords = new Set(["by", "per", "vs", "with", "and", "or"]);
  const words = title.split(" ");
  const lines = [];

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    if (smallWords.has(word.toLowerCase()) && index + 1 < words.length) {
      lines.push(`${word} ${words[index + 1]}`);
      index += 1;
    } else {
      lines.push(word);
    }
  }

  if (lines.length > 3) {
    const compact = [];
    for (const line of lines) {
      const previous = compact[compact.length - 1];
      if (previous && `${previous} ${line}`.length <= 14) {
        compact[compact.length - 1] = `${previous} ${line}`;
      } else {
        compact.push(line);
      }
    }
    lines.splice(0, lines.length, ...compact);
  }

  const last = lines.pop();
  return `${lines.map(esc).join("<br>")}<br><span>${esc(last)}</span>`;
}

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function tableHtml(headers, rows) {
  return `<table><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function schemaCards(question) {
  const tabs = question.tables.map(([name], index) => `<button class="tab${index === 0 ? " is-active" : ""}" type="button" data-table="${name}">${name}</button>`).join("");
  const cards = question.tables.map(([name, columns], index) => `<div class="schema-card${index === 0 ? " is-active" : ""}" id="schema-${name}">${tableHtml(["Column", "Type"], columns)}</div>`).join("");
  return { tabs, cards };
}

function dataBoxes(question) {
  const inputs = question.tables.map(([name, columns, rows]) => `<div class="data-box"><div class="data-box__title">Sample Input: ${name}</div>${tableHtml(columns.map(([column]) => column), rows)}</div>`).join("");
  return `${inputs}<div class="data-box"><div class="data-box__title">Expected Output</div>${tableHtml(question.outputColumns, question.outputRows)}</div>`;
}

function footerLinks(companies) {
  return companies.map((company) => `<a href="${company.slug}-1.html">${company.name}</a>`).join("") + `<a href="hero.html">Home</a>`;
}

function renderPage(company, question, index, allCompanies) {
  const num = String(index + 1).padStart(2, "0");
  const prev = `${company.slug}-${index === 0 ? company.questions.length : index}.html`;
  const next = `${company.slug}-${index === company.questions.length - 1 ? 1 : index + 2}.html`;
  const schema = schemaCards(question);
  const primaryTable = question.tables[0][0];
  const allColumns = [...new Set(question.tables.flatMap(([, columns]) => columns.map(([column]) => column)).concat(question.outputColumns))].join("|");
  const allTables = question.tables.map(([name]) => name).join("|");
  const titleParts = question.title.split(" ");
  const heroTitle = buildHeroTitle(question.title);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(question.title)} | ${esc(company.name)} SQL Interview Question</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Unbounded:wght@400;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="dnd-auth.css">
  ${companyPageStyle}
</head>
<body>
  <div class="cursor-dot" id="cursorDot"></div>
  <div class="scroll-progress" id="scrollProgress"></div>
  <main>
    <section class="hero">
      <div class="hero__main">
        <div class="brand">
          <div class="brand__mark">SQL<br><span>Lab</span></div>
          <div class="brand__meta">
            <span class="chip">${esc(company.name)}</span>
            <span class="chip chip--pink">${esc(question.product)}</span>
            <span class="chip chip--cyan">Interview</span>
            <span class="chip chip--yellow">Question ${num}</span>
          </div>
        </div>
        <div>
          <h1 class="hero__title" id="heroTitle">${heroTitle}</h1>
          <p class="hero__summary" id="heroSummary">${esc(question.prompt)}</p>
        </div>
        <div class="hero__ghost" aria-hidden="true">${esc(company.name).toUpperCase()}</div>
      </div>
      <aside class="hero__side">
        <div class="scorecard" id="scorecard">
          <div class="scorecard__item"><span class="scorecard__label">Question</span><strong class="scorecard__value">${num}</strong></div>
          <div class="scorecard__item"><span class="scorecard__label">Company</span><strong class="scorecard__value">${esc(company.name.slice(0, 4).toUpperCase())}</strong></div>
          <div class="scorecard__item"><span class="scorecard__label">Tables</span><strong class="scorecard__value">${question.tables.length}</strong></div>
          <div class="scorecard__item"><span class="scorecard__label">Engine</span><strong class="scorecard__value">PG</strong></div>
        </div>
        <div class="mini-terminal" id="miniTerminal">
          <div>
            <div class="mini-terminal__bar"><span>query brief</span><span>ready</span></div>
            <pre>company: ${esc(company.name.toLowerCase())}
product: ${esc(question.product.toLowerCase())}
primary_table: ${esc(primaryTable)}
goal: ${esc(question.prompt.toLowerCase())}</pre>
          </div>
          <pre>status: waiting for your query</pre>
        </div>
      </aside>
    </section>
    <div class="layout">
      <aside class="problem">
        <h2 class="section-title" id="problemTitle">Problem<br><span>Statement</span></h2>
        <p class="problem__text">${esc(question.prompt)}</p>
        <ul class="requirements">
          <li>${esc(company.name)} SQL Interview Question</li>
          <li>Return the columns shown in the expected output.</li>
          <li>Use the provided sample tables and aliases clearly.</li>
          <li>Assume PostgreSQL syntax unless the platform says otherwise.</li>
        </ul>
      </aside>
      <section class="workbench">
        <article class="panel" id="schemaPanel">
          <div class="panel__head"><div><p class="panel__eyebrow">Table Schema</p><h2 class="section-title">Inspect<br><span>Table</span></h2></div><span class="chip chip--cyan">interactive</span></div>
          <div class="schema-tabs" role="tablist" aria-label="Table schema tabs">${schema.tabs}</div>
          ${schema.cards}
          <div class="panel__ghost" aria-hidden="true">FROM</div>
        </article>
        <article class="panel" id="dataPanel">
          <div class="panel__head"><div><p class="panel__eyebrow">Sample Data</p><h2 class="section-title">Input<br><span>Output</span></h2></div></div>
          <div class="data-grid">${dataBoxes(question)}</div>
          <div class="panel__ghost" aria-hidden="true">DATA</div>
        </article>
        <article class="panel" id="editorPanel">
          <div class="panel__head"><div><p class="panel__eyebrow">SQL Editor</p><h2 class="section-title">Run<br><span>Query</span></h2></div></div>
          <div class="editor-wrap">
            <div class="editor-toolbar"><span>postgresql</span><div class="editor-actions"><button class="btn" type="button" id="formatBtn">Format</button><button class="btn" type="button" id="runBtn">Run Query</button></div></div>
            <div class="code-shell" id="codeShell"><pre class="code-highlight" id="sqlHighlight" aria-hidden="true"></pre><textarea id="sqlEditor" spellcheck="false" aria-label="SQL editor" placeholder="Write your SQL query here..."></textarea></div>
            <div class="query-result" id="queryResult"><span class="query-result__status" id="queryStatus">Waiting for query</span><p class="query-result__message" id="queryMessage"></p>${tableHtml(question.outputColumns, question.outputRows)}</div>
          </div>
          <div class="panel__ghost" aria-hidden="true">RUN</div>
        </article>
        <article class="panel" id="hintsPanel">
          <div class="panel__head"><div><p class="panel__eyebrow">Hints</p><h2 class="section-title">Unlock<br><span>Clues</span></h2></div><button class="btn btn--dark" type="button" id="hintBtn">Reveal Hint</button></div>
          <div class="hints">${question.hints.map((hint, hintIndex) => `<div class="hint${hintIndex === 0 ? " is-visible" : ""}">Hint ${String(hintIndex + 1).padStart(2, "0")}: ${esc(hint)}</div>`).join("")}</div>
          <div class="panel__ghost" aria-hidden="true">HELP</div>
        </article>
        <article class="panel" id="solutionPanel">
          <div class="panel__head"><div><p class="panel__eyebrow">Solution</p><h2 class="section-title">Locked<br><span>Answer</span></h2></div></div>
          <div class="solution-lock" id="solutionLock"><p>Solution is locked until you decide to reveal it. Try the editor first, then open this when you want the reference answer.</p><button class="btn" type="button" id="solutionBtn">Unlock Solution</button><pre class="solution-code">${esc(question.solution)}</pre></div>
          <div class="panel__ghost" aria-hidden="true">SQL</div>
        </article>
        <article class="panel" id="explanationPanel">
          <div class="panel__head"><div><p class="panel__eyebrow">Explanation</p><h2 class="section-title">Step By<br><span>Step</span></h2></div></div>
          <div class="explain-grid">${question.steps.map((step, stepIndex) => `<div class="step"><span class="step__num">${String(stepIndex + 1).padStart(2, "0")}</span><p>${esc(step)}</p></div>`).join("")}</div>
          <div class="panel__ghost" aria-hidden="true">WHY</div>
        </article>
      </section>
    </div>
    <section>
      <div class="panel"><div class="panel__head"><div><p class="panel__eyebrow">Related Questions</p><h2 class="section-title">Keep<br><span>Solving</span></h2></div></div></div>
      <div class="related"><a class="related-card" href="${prev}"><strong class="related-card__title">Previous Question</strong><span class="related-card__meta">back to ${index === 0 ? "10" : index}</span></a><a class="related-card" href="${next}"><strong class="related-card__title">Next Question</strong><span class="related-card__meta">continue to ${index === 9 ? "1" : index + 2}</span></a><a class="related-card" href="${company.slug}-1.html"><strong class="related-card__title">${esc(company.name)} Set</strong><span class="related-card__meta">question 1</span></a></div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="site-footer__brand">Digits<br><span>n Data</span></div>
    <nav class="site-footer__links" aria-label="Company question pages">${footerLinks(allCompanies)}</nav>
  </footer>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CustomEase.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <script>
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create("brutalist", "M0,0 C0.05,0 0.1,1 0.35,1 0.6,1 0.8,1 1,1");
    const dot = document.getElementById("cursorDot");
    document.addEventListener("mousemove", (event) => gsap.to(dot, { x: event.clientX, y: event.clientY, duration: 0.1, ease: "power2.out" }));
    document.querySelectorAll("a, button, textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => dot.classList.add("cursor-dot--large"));
      el.addEventListener("mouseleave", () => dot.classList.remove("cursor-dot--large"));
    });
    gsap.to("#scrollProgress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true } });
    gsap.from("#heroTitle", { x: -80, opacity: 0, duration: 0.9, ease: "brutalist" });
    gsap.from("#heroSummary, .brand__meta .chip", { y: 30, opacity: 0, stagger: 0.08, duration: 0.7, delay: 0.15, ease: "power3.out" });
    gsap.from("#scorecard .scorecard__item, #miniTerminal", { y: 46, opacity: 0, stagger: 0.08, duration: 0.75, delay: 0.25, ease: "back.out(1.8)" });
    gsap.to(".hero__ghost", { x: "-8%", rotation: -3, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 } });
    gsap.utils.toArray(".panel").forEach((panel) => {
      gsap.from(panel.querySelectorAll(".panel__eyebrow, .section-title, .schema-tabs, .schema-card, .data-box, .editor-wrap, .hint, .solution-lock, .step"), { opacity: 0, y: 34, duration: 0.7, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: panel, start: "top 78%", once: true } });
      const ghost = panel.querySelector(".panel__ghost");
      if (ghost) gsap.to(ghost, { x: "-5%", ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1.4 } });
    });
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((item) => item.classList.remove("is-active"));
        document.querySelectorAll(".schema-card").forEach((item) => item.classList.remove("is-active"));
        tab.classList.add("is-active");
        document.getElementById("schema-" + tab.dataset.table).classList.add("is-active");
      });
    });
    const editor = document.getElementById("sqlEditor");
    const highlight = document.getElementById("sqlHighlight");
    const codeShell = document.getElementById("codeShell");
    function escapeHtml(value) { return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function highlightSql(value) {
      const escaped = escapeHtml(value);
      return escaped
        .replace(/('(?:''|[^'])*')/g, '<span class="sql-string">$1</span>')
        .replace(/\\b(COUNT|SUM|AVG|MIN|MAX|ROUND|RANK|LAG|ROW_NUMBER|DATE_TRUNC|TO_CHAR)\\b(?=\\()/gi, '<span class="sql-function">$1</span>')
        .replace(/\\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|ON|WITH|CASE|WHEN|THEN|ELSE|END|BETWEEN|INTERVAL|GROUP BY|HAVING|ORDER BY|PARTITION BY|OVER|LIMIT|ASC|DESC|AND|OR|AS|DISTINCT|DATE)\\b/gi, '<span class="sql-keyword">$1</span>')
        .replace(/\\b(${allTables})\\b/gi, '<span class="sql-table">$1</span>')
        .replace(/\\b(${allColumns})\\b/gi, '<span class="sql-column">$1</span>')
        .replace(/\\b(\\d+(?:\\.\\d+)?)\\b/g, '<span class="sql-number">$1</span>');
    }
    function syncHighlight() { highlight.innerHTML = highlightSql(editor.value) + "\\n"; }
    function syncScroll() { highlight.style.transform = "translate(" + -editor.scrollLeft + "px, " + -editor.scrollTop + "px)"; }
    editor.addEventListener("input", syncHighlight);
    editor.addEventListener("scroll", syncScroll);
    syncHighlight();
    const queryResult = document.getElementById("queryResult");
    const queryStatus = document.getElementById("queryStatus");
    const queryMessage = document.getElementById("queryMessage");
    function normalizeSql(value) { return value.replace(/--.*$/gm, " ").replace(/\\/\\*[\\s\\S]*?\\*\\//g, " ").replace(/\\s+/g, " ").trim().toLowerCase(); }
    function isCorrectQuery(value) {
      const normalized = normalizeSql(value);
      return /\\bselect\\b/.test(normalized) && /\\bfrom\\s+${primaryTable}\\b/.test(normalized);
    }
    const wowSound = new Audio("Wow sound effect.mp3");
    wowSound.preload = "auto";
    const errorSound = new Audio("faah-sound-effect.mp3");
    errorSound.preload = "auto";
    function playWowSound() { wowSound.currentTime = 0; wowSound.play().catch(() => {}); }
    function playErrorSound() { errorSound.currentTime = 0; errorSound.play().catch(() => {}); }
    function randomBetween(min, max) { return parseInt(Math.random() * (max - min) + min, 10); }
    function playCorrectBurst(event) {
      if (typeof confetti !== "function") return;
      const rect = event.currentTarget.getBoundingClientRect();
      const clientX = event.clientX || rect.left + rect.width / 2;
      const clientY = event.clientY || rect.top + rect.height / 2;
      confetti({ particleCount: randomBetween(122, 245), spread: randomBetween(45, 80), origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight } });
    }
    document.getElementById("runBtn").addEventListener("click", (event) => {
      const sql = editor.value.trim();
      queryResult.classList.add("is-visible");
      queryResult.classList.remove("is-correct");
      queryStatus.classList.remove("is-error");
      if (!sql) {
        queryStatus.textContent = "No query found";
        queryStatus.classList.add("is-error");
        queryMessage.textContent = "Write a SQL query first, then run it.";
        playErrorSound();
      } else if (isCorrectQuery(sql)) {
        queryResult.classList.add("is-correct");
        queryStatus.textContent = "Query shape accepted";
        queryMessage.textContent = "This page checks the basic query shape and shows the expected output for comparison.";
        playWowSound();
        playCorrectBurst(event);
      } else {
        queryStatus.textContent = "Query needs fixing";
        queryStatus.classList.add("is-error");
        queryMessage.textContent = "Start with SELECT and read from the primary table: ${primaryTable}.";
        playErrorSound();
      }
      gsap.fromTo(queryResult, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
    });
    document.getElementById("formatBtn").addEventListener("click", () => {
      editor.value = editor.value.replace(/\\bselect\\b/gi, "SELECT").replace(/\\bfrom\\b/gi, "FROM").replace(/\\bwhere\\b/gi, "WHERE").replace(/\\bjoin\\b/gi, "JOIN").replace(/\\bgroup by\\b/gi, "GROUP BY").replace(/\\bhaving\\b/gi, "HAVING").replace(/\\border by\\b/gi, "ORDER BY").replace(/\\blimit\\b/gi, "LIMIT").replace(/\\bcount\\b/gi, "COUNT").replace(/\\bsum\\b/gi, "SUM").replace(/\\bavg\\b/gi, "AVG").replace(/\\bdistinct\\b/gi, "DISTINCT");
      syncHighlight();
      gsap.fromTo(codeShell, { backgroundColor: "#262600" }, { backgroundColor: "#111111", duration: 0.45 });
    });
    const hints = Array.from(document.querySelectorAll(".hint"));
    let hintIndex = 1;
    document.getElementById("hintBtn").addEventListener("click", () => {
      if (hintIndex >= hints.length) return;
      hints[hintIndex].classList.add("is-visible");
      gsap.from(hints[hintIndex], { opacity: 0, x: -24, duration: 0.45, ease: "power2.out" });
      hintIndex += 1;
    });
    document.getElementById("solutionBtn").addEventListener("click", () => {
      const lock = document.getElementById("solutionLock");
      lock.classList.toggle("is-open");
      document.getElementById("solutionBtn").textContent = lock.classList.contains("is-open") ? "Hide Solution" : "Unlock Solution";
      if (lock.classList.contains("is-open")) gsap.from(".solution-code", { opacity: 0, y: 18, duration: 0.45, ease: "power2.out" });
    });
  </script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="supabase-config.js"></script>
  <script src="auth.js"></script>
  <script>window.DNDAuth && window.DNDAuth.init({ protect: true });</script>
</body>
</html>`;
}

for (const company of companies) {
  company.questions.forEach((question, index) => {
    fs.writeFileSync(`${company.slug}-${index + 1}.html`, renderPage(company, question, index, companies));
  });
}

fs.writeFileSync("companies.html", `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company SQL Interview Questions</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Unbounded:wght@400;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="dnd-auth.css">
  ${companyPageStyle}
</head>
<body>
  <main>
    <section class="hero">
      <div class="hero__main">
        <div class="brand"><div class="brand__mark">SQL<br><span>Lab</span></div><div class="brand__meta"><span class="chip">Company Sets</span><span class="chip chip--pink">60 Questions</span></div></div>
        <div><h1 class="hero__title" id="heroTitle">Company<br><span>SQL</span><br>Questions</h1><p class="hero__summary">Google, Uber, Airbnb, Microsoft, Spotify, and Meta SQL interview question sets.</p></div>
        <div class="hero__ghost" aria-hidden="true">SQL</div>
      </div>
      <aside class="hero__side"><div class="scorecard">${companies.map((company) => `<a class="related-card" href="${company.slug}-1.html"><strong class="related-card__title">${company.name}</strong><span class="related-card__meta">10 questions</span></a>`).join("")}</div></aside>
    </section>
  </main>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="supabase-config.js"></script>
  <script src="auth.js"></script>
  <script>window.DNDAuth && window.DNDAuth.init({ protect: false });</script>
</body>
</html>`);

console.log(`Generated ${companies.reduce((sum, company) => sum + company.questions.length, 0)} company question pages plus companies.html`);
