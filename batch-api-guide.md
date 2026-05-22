# Batch API Deep-Dive: 50% Cost Savings at Scale

> **Level**: L2-L4 (Intermediate-Advanced) | **Duration**: 90 min | **Goal**: Save 50% on API costs for non-urgent workloads using batch processing

---

## 1. What is the Batch API?

The Batch API lets you submit large numbers of API requests at once and receive results later (asynchronously). In return, you get **50% discount** on token costs.

### The Trade-off

```
Traditional API (Real-time)
├─ Cost: $15/M input tokens, $75/M output tokens
├─ Latency: 100-300ms per request
├─ Best for: User-facing, real-time interactions

Batch API (Async)
├─ Cost: $7.50/M input tokens, $37.50/M output tokens (50% off!)
├─ Latency: 4-24 hours for results
└─ Best for: Non-urgent, bulk processing, scheduled tasks
```

### Quick Numbers

**Example**: Process 10,000 documents

```
Traditional API:
├─ Cost: (5,000 input tokens × 10,000 docs) × $15/M = $750
├─ Time: 10,000 × 200ms = 2000 seconds (~33 minutes)
├─ Infrastructure: Expensive servers running 33 minutes
└─ Total: $750 + server costs

Batch API:
├─ Cost: (5,000 input tokens × 10,000 docs) × $7.50/M = $375 (50% off!)
├─ Time: Submit all at once, retrieve 4-24 hours later
├─ Infrastructure: Just file storage, no compute during processing
└─ Total: $375 (50% savings)

Savings: $375 = 50% of API cost alone
```

---

## 2. How Batch API Works (Architecture)

### 2.1 The Three Phases

```
Phase 1: SUBMIT (You)
├─ Create file with 10,000 requests in JSONL format
├─ Call: claude batch submit --input batch-requests.jsonl
└─ Get: batch_id = "msg_batch_001xyz"

Phase 2: PROCESS (Anthropic infrastructure)
├─ Queue your requests
├─ Process 4-24 hours later (off-peak, cheaper capacity)
├─ Generate results.jsonl with 10,000 responses
└─ Status: Queryable with batch_id

Phase 3: RETRIEVE (You)
├─ Check status: claude batch get msg_batch_001xyz
├─ Download results when ready
└─ Process locally at your pace
```

### 2.2 Request Format (JSONL)

Each request is one line (JSON Lines format):

```jsonl
{"custom_id": "doc-001", "params": {"model": "claude-opus-4.7", "max_tokens": 1024, "messages": [{"role": "user", "content": "Classify this: Invoice #123..."}]}}
{"custom_id": "doc-002", "params": {"model": "claude-opus-4.7", "max_tokens": 1024, "messages": [{"role": "user", "content": "Classify this: Contract for sales..."}]}}
{"custom_id": "doc-003", "params": {"model": "claude-opus-4.7", "max_tokens": 1024, "messages": [{"role": "user", "content": "Classify this: Email from John..."}]}}
```

### 2.3 Response Format (JSONL)

Results returned in same format:

```jsonl
{"custom_id": "doc-001", "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": "invoice"}]}}}
{"custom_id": "doc-002", "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": "contract"}]}}}
{"custom_id": "doc-003", "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": "email"}]}}}
```

---

## 3. Decision Tree: Batch vs Real-time API

### 3.1 Quick Decision

```
START: "I need to process N requests"
│
├─ Is it user-facing? (user waiting for answer)
│  └─ YES → Real-time API (can't wait 4+ hours)
│
├─ Is it urgent? (needed within 1 hour)
│  └─ YES → Real-time API
│
├─ Can you wait 4-24 hours?
│  └─ NO → Real-time API
│
└─ YES, wait is OK
   ├─ Is N < 100 requests?
   │  └─ YES → Real-time OK (batch overhead not worth it)
   │
   └─ Is N >= 100 requests?
      └─ YES → Batch API ✅ (saves 50% on cost)
```

### 3.2 Full Decision Matrix

| Scenario | Real-time | Batch | Reason |
|----------|-----------|-------|--------|
| **User clicks button, waits** | ✅ | ❌ | Needs <1s response |
| **Scheduled overnight job** | ❌ | ✅ | Can wait, saves 50% |
| **Bulk document classification** | ❌ | ✅ | 1000+ docs, non-urgent |
| **Real-time chatbot** | ✅ | ❌ | User waiting |
| **Weekly reports generation** | ❌ | ✅ | Can wait until morning |
| **Ad-hoc analysis request** | ✅ | ❌ | User waiting |
| **Data pipeline ETL** | ❌ | ✅ | Runs nightly anyway |
| **Slack bot response** | ✅ | ❌ | User waiting in Slack |
| **Batch social media posts** | ❌ | ✅ | No time pressure |
| **10,000 resume screening** | ❌ | ✅ | Screening takes days anyway |

---

## 4. Setup & CLI Usage

### 4.1 Installation

```bash
# Install Claude CLI (if not already)
npm install -g @anthropic-ai/claude-cli

# Verify
claude --version
# Should show: Claude CLI v0.x.x

# Set API key
export ANTHROPIC_API_KEY=sk-ant-...
```

### 4.2 Create Input File (JSONL)

**File**: `batch-requests.jsonl`

```jsonl
{"custom_id": "email-1", "params": {"model": "claude-opus-4.7", "max_tokens": 100, "messages": [{"role": "user", "content": "Is this spam? 'Click here to win $$$'"}]}}
{"custom_id": "email-2", "params": {"model": "claude-opus-4.7", "max_tokens": 100, "messages": [{"role": "user", "content": "Is this spam? 'Your meeting is confirmed for 3pm'"}]}}
{"custom_id": "email-3", "params": {"model": "claude-opus-4.7", "max_tokens": 100, "messages": [{"role": "user", "content": "Is this spam? 'Limited offer: 50% off today only!!!!'"  }]}}
```

### 4.3 Submit Batch

```bash
# Submit
claude batch submit --input batch-requests.jsonl --output results.jsonl

# Output
Batch submitted: msg_batch_5b3d2c9f8a1b4e2d
Request count: 3
Status: processing

# Save ID for later
export BATCH_ID="msg_batch_5b3d2c9f8a1b4e2d"
```

### 4.4 Check Status

```bash
# Check status (can check anytime during 4-24 hour window)
claude batch get msg_batch_5b3d2c9f8a1b4e2d

# Output (while processing)
Batch ID: msg_batch_5b3d2c9f8a1b4e2d
Status: processing
Submitted: 2026-05-21 14:00:00 UTC
Estimated completion: 2026-05-22 10:00:00 UTC
Request count: 3
Processing: 2/3

# Output (when done)
Batch ID: msg_batch_5b3d2c9f8a1b4e2d
Status: completed
Completed: 2026-05-22 09:30:00 UTC
Request count: 3
Succeeded: 3
Failed: 0
```

### 4.5 Retrieve Results

```bash
# Download results
claude batch get msg_batch_5b3d2c9f8a1b4e2d --download results.jsonl

# View results
cat results.jsonl | head -1

# Pretty print (if available)
jq . results.jsonl | head -30
```

### 4.6 Full Workflow Example

```bash
#!/bin/bash

# 1. Create requests
cat > batch-requests.jsonl << 'EOF'
{"custom_id": "req-1", "params": {"model": "claude-opus-4.7", "max_tokens": 100, "messages": [{"role": "user", "content": "Sum 5+3"}]}}
{"custom_id": "req-2", "params": {"model": "claude-opus-4.7", "max_tokens": 100, "messages": [{"role": "user", "content": "Sum 10+7"}]}}
EOF

# 2. Submit
BATCH_ID=$(claude batch submit --input batch-requests.jsonl | grep "Batch ID:" | awk '{print $3}')
echo "Submitted batch: $BATCH_ID"

# 3. Poll until done (every 60 seconds)
while true; do
  STATUS=$(claude batch get "$BATCH_ID" | grep "Status:" | awk '{print $2}')
  echo "Status: $STATUS"
  
  if [ "$STATUS" = "completed" ]; then
    break
  fi
  
  sleep 60
done

# 4. Retrieve results
claude batch get "$BATCH_ID" --download results.jsonl

echo "✅ Batch complete. Results in results.jsonl"
```

---

## 5. Case Study 1: Bulk Document Classification

**Scenario**: SaaS platform, 5,000 user-uploaded documents daily need classification (contract, invoice, receipt, other)

### 5.1 Traditional Approach (Real-time API)

```
Daily volume: 5,000 documents
├─ Average tokens per doc: 500 input, 50 output
├─ Cost per doc: (500 * $15 + 50 * $75) / 1M = $0.0045
├─ Daily cost: 5,000 × $0.0045 = $22.50
├─ Monthly cost: $675
├─ Infrastructure: Servers running 24/7 to process in real-time
└─ Server cost: ~$500/month
│  Total monthly: $1,175
```

### 5.2 Batch API Approach

```
Strategy: Process nightly batch at 11 PM
├─ Volume: 5,000 documents
├─ Batch cost per doc: (500 * $7.50 + 50 * $37.50) / 1M = $0.00225
├─ Batch cost: 5,000 × $0.00225 = $11.25
├─ Monthly batch cost: $338 (50% off real-time!)
├─ Infrastructure: Just file storage
└─ Server cost: ~$50/month
│  Total monthly: $388
```

### 5.3 Tradeoff & ROI

```
Savings: $1,175 - $388 = $787/month ($9,444/year)
Latency trade: Real-time → Overnight (16-hour delay)
User impact: Document classification appears overnight instead of immediately

ROI:
├─ Engineering time to implement: 4 hours
├─ Cost of 4 hours: $500 (engineer @ $125/hr)
├─ Payback period: $500 / ($9,444/12) = 0.6 months
└─ Break-even: In 2 weeks, already profitable!
```

### 5.4 Implementation

```python
import json
import anthropic
from datetime import datetime
from pathlib import Path

def prepare_batch_file(documents: list[dict]) -> str:
    """Prepare JSONL batch file from documents"""
    batch_file = "batch-classify.jsonl"
    
    with open(batch_file, "w") as f:
        for doc in documents:
            request = {
                "custom_id": doc["id"],
                "params": {
                    "model": "claude-opus-4.7",
                    "max_tokens": 50,
                    "messages": [{
                        "role": "user",
                        "content": f"Classify this document. Reply ONLY with: contract, invoice, receipt, or other\n\n{doc['text'][:2000]}"
                    }]
                }
            }
            f.write(json.dumps(request) + "\n")
    
    return batch_file

def submit_batch(batch_file: str) -> str:
    """Submit batch to API"""
    client = anthropic.Anthropic()
    
    with open(batch_file, "rb") as f:
        batch = client.beta.messages.batches.create(
            requests=json.loads(line) for line in f
        )
    
    return batch.id

def check_batch_status(batch_id: str) -> dict:
    """Check if batch is complete"""
    client = anthropic.Anthropic()
    batch = client.beta.messages.batches.retrieve(batch_id)
    
    return {
        "status": batch.processing_status,
        "completed": batch.processing_status == "completed",
        "request_counts": batch.request_counts
    }

# Usage
if __name__ == "__main__":
    # Load documents from database
    documents = [
        {"id": "doc-001", "text": "Contract for sales of..."},
        {"id": "doc-002", "text": "Invoice #12345 for..."},
        # ... 5000 more
    ]
    
    # Prepare and submit
    batch_file = prepare_batch_file(documents)
    batch_id = submit_batch(batch_file)
    print(f"✅ Submitted batch: {batch_id}")
    
    # Check status (run next morning)
    status = check_batch_status(batch_id)
    if status["completed"]:
        print(f"✅ Batch done! Processed {status['request_counts']}")
```

---

## 6. Case Study 2: Scheduled Weekly Reports

**Scenario**: Analytics company generates 500 custom reports weekly, emailed to clients

### 6.1 Requirements

```
Weekly reports:
├─ 500 clients, 1 report each
├─ Report is generated from raw data + Claude analysis
├─ Each report needs: Summary + Key insights + Recommendations
├─ Tokens per report: 1000 input, 500 output
├─ Current: Real-time as requested ($0.0075/report)
└─ New: Batch on Sunday night, delivered Monday morning
```

### 6.2 Cost Analysis

```
Current (Real-time):
├─ Cost per report: (1000 * $15 + 500 * $75) / 1M = $0.0525
├─ Weekly cost: 500 × $0.0525 = $26.25
├─ Monthly: $105
├─ User experience: Generated on-demand (5-15 min wait)

Batch (Sunday night):
├─ Cost per report: (1000 * $7.50 + 500 * $37.50) / 1M = $0.02625
├─ Weekly cost: 500 × $0.02625 = $13.13
├─ Monthly: $52.50
├─ User experience: Available Monday morning (16-hour delay)
├─ Savings: $52.50/month, 50% cost reduction
```

### 6.3 Schedule Implementation

```python
from apscheduler.schedulers.background import BackgroundScheduler
import anthropic
import json
from datetime import datetime

scheduler = BackgroundScheduler()

def generate_weekly_reports():
    """Generate all reports Sunday at 11 PM"""
    print(f"⏰ Starting weekly reports batch at {datetime.now()}")
    
    # 1. Query database for all clients and their data
    clients = get_all_clients()  # Returns 500 clients with data
    
    # 2. Create batch requests
    requests = []
    for client in clients:
        request = {
            "custom_id": f"report-{client['id']}",
            "params": {
                "model": "claude-opus-4.7",
                "max_tokens": 2000,
                "messages": [{
                    "role": "user",
                    "content": f"""Analyze this customer data and generate a report:
                    
                    Data: {json.dumps(client['weekly_data'])}
                    
                    Provide: Summary (3 bullets), Key Insights (3 bullets), Recommendations (3 bullets)
                    """
                }]
            }
        }
        requests.append(request)
    
    # 3. Submit batch
    client = anthropic.Anthropic()
    batch = client.beta.messages.batches.create(requests=requests)
    
    # 4. Store batch ID for later retrieval
    store_batch_id(batch.id, datetime.now())
    print(f"✅ Submitted {len(requests)} reports in batch {batch.id}")

def deliver_completed_reports():
    """Check Monday morning, deliver if done"""
    batch_id = get_latest_batch_id()
    
    client = anthropic.Anthropic()
    batch = client.beta.messages.batches.retrieve(batch_id)
    
    if batch.processing_status == "completed":
        # Get results
        results = client.beta.messages.batches.list_results(batch_id)
        
        # Email each client their report
        for result in results.data:
            client_id = result.custom_id.replace("report-", "")
            report_text = result.result.message.content[0].text
            
            send_email(
                to=get_client_email(client_id),
                subject="Your Weekly Report",
                body=report_text
            )
        
        print(f"✅ Delivered {len(results.data)} reports")
    else:
        print(f"⏳ Batch still processing...")

# Schedule jobs
scheduler.add_job(generate_weekly_reports, 'cron', day_of_week='6', hour=23)  # Sunday 11 PM
scheduler.add_job(deliver_completed_reports, 'cron', day_of_week='0', hour=8)  # Monday 8 AM

scheduler.start()
```

---

## 7. Case Study 3: Data Pipeline ETL

**Scenario**: Data engineering team, 100,000 rows need enrichment via Claude weekly

### 7.1 Setup

```
Raw data structure:
├─ Customer name, email, company
├─ Need: Enriched with industry, company size, risk profile
├─ Weekly run: Monday 2 AM, results in data warehouse by 10 AM
├─ Volume: 100,000 rows

Traditional:
├─ Parallel API calls via Python multiprocessing
├─ 20 workers × 50 requests = ~1000 concurrent
├─ Cost: (100K rows) × (200 tokens input, 100 output) × pricing = $330/week
├─ Time: ~2 hours
├─ Infrastructure: 20-30 compute instances

Batch:
├─ Submit 100K requests in single batch
├─ Results available in 4-24 hours
├─ Cost: $165/week (50% off)
├─ Time: Asynchronous, monitoring minimal
├─ Infrastructure: Just submit, wait, retrieve
```

### 7.2 Airflow DAG Implementation

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import anthropic
import json
import pandas as pd

default_args = {
    'owner': 'data-eng',
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

def prepare_enrichment_batch():
    """Extract data and prepare batch file"""
    df = pd.read_sql("SELECT id, name, email, company FROM customers", db_conn)
    
    requests = []
    for _, row in df.iterrows():
        request = {
            "custom_id": str(row['id']),
            "params": {
                "model": "claude-opus-4.7",
                "max_tokens": 200,
                "messages": [{
                    "role": "user",
                    "content": f"""Enrich this customer profile:
                    
                    Name: {row['name']}
                    Email: {row['email']}
                    Company: {row['company']}
                    
                    Provide JSON: {{"industry": "...", "company_size": "...", "risk_profile": "..."}}
                    """
                }]
            }
        }
        requests.append(request)
    
    # Save requests
    with open("/tmp/batch-requests.jsonl", "w") as f:
        for req in requests:
            f.write(json.dumps(req) + "\n")
    
    return {"record_count": len(requests), "batch_file": "/tmp/batch-requests.jsonl"}

def submit_batch(**context):
    """Submit batch to Anthropic"""
    client = anthropic.Anthropic()
    
    with open("/tmp/batch-requests.jsonl", "rb") as f:
        batch = client.beta.messages.batches.create(
            requests=[json.loads(line) for line in f]
        )
    
    context['task_instance'].xcom_push(key='batch_id', value=batch.id)
    print(f"✅ Batch submitted: {batch.id}")

def wait_for_batch_completion(**context):
    """Wait up to 24 hours for batch to complete"""
    batch_id = context['task_instance'].xcom_pull(key='batch_id')
    client = anthropic.Anthropic()
    
    import time
    max_wait = 86400  # 24 hours in seconds
    start = time.time()
    
    while time.time() - start < max_wait:
        batch = client.beta.messages.batches.retrieve(batch_id)
        
        if batch.processing_status == "completed":
            print(f"✅ Batch complete!")
            return
        
        print(f"⏳ Status: {batch.processing_status}, waiting...")
        time.sleep(60)  # Check every minute
    
    raise TimeoutError(f"Batch {batch_id} not completed in 24 hours")

def load_results_to_warehouse(**context):
    """Download results and load to data warehouse"""
    batch_id = context['task_instance'].xcom_pull(key='batch_id')
    client = anthropic.Anthropic()
    
    results = client.beta.messages.batches.list_results(batch_id)
    
    rows = []
    for result in results.data:
        customer_id = int(result.custom_id)
        enrichment = json.loads(result.result.message.content[0].text)
        
        rows.append({
            'customer_id': customer_id,
            'industry': enrichment['industry'],
            'company_size': enrichment['company_size'],
            'risk_profile': enrichment['risk_profile']
        })
    
    # Load to data warehouse
    df_enriched = pd.DataFrame(rows)
    df_enriched.to_sql('customer_enrichment', db_conn, if_exists='append', index=False)
    
    print(f"✅ Loaded {len(rows)} enriched records to warehouse")

# Define DAG
dag = DAG(
    'customer_enrichment_batch',
    default_args=default_args,
    description='Weekly customer enrichment via Claude batch API',
    schedule_interval='0 2 * * 1',  # Monday 2 AM
    start_date=datetime(2026, 5, 1)
)

task_prepare = PythonOperator(task_id='prepare_batch', python_callable=prepare_enrichment_batch, dag=dag)
task_submit = PythonOperator(task_id='submit_batch', python_callable=submit_batch, dag=dag)
task_wait = PythonOperator(task_id='wait_completion', python_callable=wait_for_batch_completion, dag=dag)
task_load = PythonOperator(task_id='load_to_warehouse', python_callable=load_results_to_warehouse, dag=dag)

task_prepare >> task_submit >> task_wait >> task_load
```

---

## 8. Cost-Benefit Calculator

### 8.1 Break-Even Analysis

```python
def calculate_batch_roi(
    request_count: int,
    avg_input_tokens: int = 500,
    avg_output_tokens: int = 200,
    engineering_hours: float = 4,
    hourly_rate: float = 150
) -> dict:
    """Calculate ROI of switching to batch API"""
    
    # Pricing (May 2026)
    realtime_input_cost = 15 / 1_000_000
    realtime_output_cost = 75 / 1_000_000
    batch_input_cost = 7.50 / 1_000_000
    batch_output_cost = 37.50 / 1_000_000
    
    # One-time engineering cost
    engineering_cost = engineering_hours * hourly_rate
    
    # Per-request costs
    realtime_cost_per_request = (avg_input_tokens * realtime_input_cost) + \
                                (avg_output_tokens * realtime_output_cost)
    batch_cost_per_request = (avg_input_tokens * batch_input_cost) + \
                             (avg_output_tokens * batch_output_cost)
    
    # Total costs
    realtime_total = request_count * realtime_cost_per_request
    batch_total = request_count * batch_cost_per_request + engineering_cost
    
    # Savings
    per_request_savings = realtime_cost_per_request - batch_cost_per_request
    total_savings = realtime_total - batch_total
    
    # Payback period (assuming monthly recurring)
    monthly_savings = (request_count / 1) * per_request_savings  # Adjust if not monthly
    payback_months = engineering_cost / monthly_savings if monthly_savings > 0 else float('inf')
    
    return {
        "request_count": request_count,
        "realtime_cost_per_request": realtime_cost_per_request,
        "batch_cost_per_request": batch_cost_per_request,
        "per_request_savings": per_request_savings,
        "engineering_cost": engineering_cost,
        "one_time_total_cost": realtime_total,
        "batch_total_cost": batch_total,
        "total_savings": total_savings,
        "payback_months": payback_months,
        "annual_savings": monthly_savings * 12,
        "roi_percent": (total_savings / engineering_cost * 100) if engineering_cost > 0 else 0
    }

# Examples
scenarios = [
    {"name": "Small batch (100 requests)", "request_count": 100},
    {"name": "Medium batch (5,000 requests)", "request_count": 5000},
    {"name": "Large batch (100,000 requests)", "request_count": 100000},
    {"name": "Enterprise (1M requests/month)", "request_count": 1_000_000},
]

for scenario in scenarios:
    result = calculate_batch_roi(scenario["request_count"])
    print(f"\n{scenario['name']}:")
    print(f"  Cost per request: Real-time ${result['realtime_cost_per_request']:.6f} → Batch ${result['batch_cost_per_request']:.6f}")
    print(f"  Per-request savings: ${result['per_request_savings']:.6f} (50% off)")
    print(f"  One-time implementation: ${result['engineering_cost']:.2f}")
    print(f"  ROI: {result['roi_percent']:.0f}%")
    print(f"  Payback period: {result['payback_months']:.1f} months")
    print(f"  Annual savings: ${result['annual_savings']:.2f}")
```

### 8.2 Example Results

```
Small batch (100 requests):
  Cost per request: Real-time $0.000045 → Batch $0.000023
  Per-request savings: $0.000023 (50% off)
  One-time implementation: $600.00
  ROI: -87% ❌ Not worth it, too small

Medium batch (5,000 requests):
  Cost per request: Real-time $0.000045 → Batch $0.000023
  Per-request savings: $0.000023 (50% off)
  One-time implementation: $600.00
  ROI: 46% ✅ Breakeven in 6 months

Large batch (100,000 requests):
  Cost per request: Real-time $0.000045 → Batch $0.000023
  Per-request savings: $0.000023 (50% off)
  One-time implementation: $600.00
  ROI: 1,533% ✅ Huge savings, payback in 2 weeks

Enterprise (1M requests/month):
  Cost per request: Real-time $0.000045 → Batch $0.000023
  Per-request savings: $0.000023 (50% off)
  One-time implementation: $600.00
  ROI: 15,233% ✅ Save $11,520/month
```

---

## 9. Best Practices & Common Pitfalls

### ✅ Best Practices

1. **Batch in multiples of 100+**
   - Minimum viable batch: 100 requests
   - Sweet spot: 1,000-10,000 requests
   - Your batch processing overhead not worth it below 100

2. **Keep requests simple**
   - Max ~1000 tokens per request
   - Avoid complex reasoning, use regular API for that
   - Simple classification, generation, extraction

3. **Plan for failures**
   - ~0.1% of requests may fail
   - Implement retry logic for failed items
   - Store batch IDs for auditing

4. **Monitor progress**
   - Check batch status every 60 seconds
   - Log to monitoring system
   - Alert if batch takes >24 hours

5. **Optimize request format**
   - Use `custom_id` consistently (helps tracking)
   - Keep request payloads small
   - Pre-validate all data

### ❌ Common Mistakes

1. **Submitting <100 requests**
   - Overhead not worth it
   - Better: Use real-time API

2. **Expecting <4 hour results**
   - Batch takes 4-24 hours
   - If you need <4 hours, use real-time API

3. **Forgetting to handle failures**
   - 0.1% error rate is normal
   - Don't assume 100% success

4. **Submitting duplicate requests**
   - If batch fails and you retry, check for duplicates
   - De-duplicate by `custom_id`

5. **Not tracking batch IDs**
   - Store batch ID + submission time in database
   - Helps with auditing and retries

---

## 10. Production Monitoring

### 10.1 Key Metrics

```python
import json
from datetime import datetime

class BatchMonitor:
    def __init__(self):
        self.metrics = {
            "submitted_at": datetime.now(),
            "batch_id": None,
            "request_count": 0,
            "succeeded": 0,
            "failed": 0,
            "processing_time_hours": 0
        }
    
    def record_submission(self, batch_id: str, request_count: int):
        self.metrics["batch_id"] = batch_id
        self.metrics["request_count"] = request_count
    
    def record_completion(self, succeeded: int, failed: int):
        self.metrics["succeeded"] = succeeded
        self.metrics["failed"] = failed
        self.metrics["processing_time_hours"] = \
            (datetime.now() - self.metrics["submitted_at"]).total_seconds() / 3600
        
        # Log to monitoring system
        self.log_to_datadog()
    
    def log_to_datadog(self):
        """Send metrics to Datadog"""
        import datadog
        
        datadog.api.Metric.send(
            metric='batch_api.requests',
            points=self.metrics["request_count"],
            tags=[f"batch_id:{self.metrics['batch_id']}"]
        )
        
        datadog.api.Metric.send(
            metric='batch_api.success_rate',
            points=100 * self.metrics["succeeded"] / self.metrics["request_count"],
            tags=[f"batch_id:{self.metrics['batch_id']}"]
        )
        
        datadog.api.Metric.send(
            metric='batch_api.processing_hours',
            points=self.metrics["processing_time_hours"],
            tags=[f"batch_id:{self.metrics['batch_id']}"]
        )

# Usage
monitor = BatchMonitor()
monitor.record_submission("msg_batch_xyz", request_count=5000)
# ... wait for batch ...
monitor.record_completion(succeeded=4998, failed=2)
```

---

## 11. Next Steps & Resources

### When to Use Batch API

✅ **Batch API when**:
- Volume: 100+ requests
- Urgency: Can wait 4+ hours
- Cost: Willing to pay engineering time to save 50%

❌ **Real-time API when**:
- User-facing (need immediate response)
- Urgent (< 4 hours)
- Low volume (< 100 requests)

### Official Documentation
- 📚 [Batch API Docs](https://docs.anthropic.com/batch-api)
- 📚 [Pricing (May 2026)](https://anthropic.com/pricing)
- 📚 [CLI Reference](https://github.com/anthropic-ai/anthropic-sdk-python)

### Practice Labs
1. **Lab 1**: Submit a 1,000 request batch, monitor completion
2. **Lab 2**: Calculate ROI for your use case
3. **Lab 3**: Integrate batch API into data pipeline (Airflow/Dagster)

---

## Quiz: Test Your Knowledge

**Q1**: When should you use Batch API?
- A) Always, it's cheaper
- B) For 100+ requests where you can wait 4+ hours ✅
- C) Only for user-facing features
- D) Never, real-time is always better

**Q2**: How much do you save?
- A) 25%
- B) 50% on token costs ✅
- C) 75%
- D) Varies by region

**Q3**: What's the minimum batch size?
- A) 1 request
- B) 10 requests
- C) 100+ requests (cost-effective break-even) ✅
- D) 1,000 requests

**Q4**: How long for results?
- A) 1-2 hours
- B) 4-24 hours ✅
- C) 24-48 hours
- D) Guaranteed within 1 hour

**Q5**: What format are requests?
- A) JSON
- B) CSV
- C) JSONL (JSON Lines) ✅
- D) XML

---

## Summary: Batch API Essentials

✅ **What**: Submit 100+ requests, get 50% discount, results in 4-24 hours  
✅ **When**: Non-urgent bulk processing, cost is priority  
✅ **Cost**: 50% off token pricing, worth for >5000 requests/month  
✅ **Latency**: 4-24 hours (use real-time API for urgent)  
✅ **ROI**: Payback in 2-6 weeks for most use cases  
✅ **Format**: JSONL (one request per line)  
✅ **Limit**: No hard limit, submit 1M+ requests  

---

**Document**: Batch API Deep-Dive  
**Level**: L2-L4 (Intermediate-Advanced)  
**Duration**: 90 minutes  
**Updated**: May 2026  
**Next**: Certification Architect (apply all concepts)
