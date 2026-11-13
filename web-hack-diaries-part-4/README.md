# WebHackDiaries – Part 4: SSRF (Server-Side Request Forgery) 🔥

**Source:** PortSwigger Academy

**Texter:** Muhammed Abdulazeez

## What is SSRF? 🤔

**Server-Side Request Forgery (SSRF)** is a vulnerability where an attacker tricks a server into making HTTP requests to locations they choose.

Instead of the attacker directly connecting to the target, they force the **server itself** to connect.

### ✅ Impact:

- Access internal-only services 🏠
- Bypass network restrictions 🔓
- Access admin panels 🛡️
- Read sensitive data 🔥
- Remote code execution (RCE) in some cases 💀

## Why SSRF is Dangerous 🚨

SSRF is dangerous because:

- The server can reach internal systems that are not exposed publicly 🔥
- Internal services often have weak security 🧨
- Servers often trust localhost/internal IP requests 🧠

---

## SSRF Attack Types & Impact 🧩

### 1. SSRF against the server (localhost) 🖥️

Attackers can force the server to connect to:

```text
http://localhost/admin
```

Example Lab Flow:

1. Intercept stock check request
2. Replace `stockApi` with: `http://localhost/admin`
3. Server returns admin content, bypassing login 🚪

### 2. SSRF against internal back-end systems 🏢

Server can access internal IP addresses like:

```text
http://192.168.0.68/admin
```

**Example Lab Flow:**

1. Use Burp Intruder to brute force internal IPs
2. Find internal host that returns 200
3. Use SSRF to access admin and delete users 💀

### 3. SSRF with Blacklist Filters 🚫

Apps block values like:

```text
127.0.0.1, localhost, /admin
```

**Bypass techniques:**

- Alternative IP formats:
  - `127.1`
  - `2130706433`
  - `017700000001`
- URL encoding:
  - `%2561` for `a`
- Redirectors:
  - `spoofed.burpcollaborator.net`

### 4. SSRF with Whitelist Filters 🧪

Some apps only allow specific domains.

**Bypass techniques:**

1. **Embedded credentials**
   ```text
   https://allowed-domain:pass@evil.com
   ```
2. **URL Fragment**
   ```text
   https://evil.com#allowed-domain
   ```
3. **Subdomain trick**
   ```text
   https://allowed-domain.evil.com
   ```
4. **URL encoding**
   ```text
   https://allowed-domain%2Eevil.com
   ```

### 5. SSRF via Open Redirection 🔁

When SSRF is blocked by whitelist, you can exploit open redirect.

**How it works:**

1. Send allowed URL
2. It redirects to internal target
3. Server follows redirect → SSRF success

**Example Lab Flow:**

```text
stockApi=http://weliketoshop.net/product/nextProduct?path=http://192.168.0.12:8080/admin
```

Server follows redirect and loads admin page 👑

---

## Blind SSRF (Most Important Section) 👁️

### What is Blind SSRF? 🤷

Blind SSRF happens when:

- you can make the server send a request
- but you **don’t see the response**

This makes exploitation harder, but still dangerous.

### Impact of Blind SSRF ⚠️

Blind SSRF usually has lower impact than normal SSRF because:

- you cannot read data directly
- but it can still:
  - trigger actions (delete users, send emails) 📨
  - scan internal networks 🕵️
  - lead to RCE in some cases 💀

### Detecting Blind SSRF 🕵️‍♂️

The best method is **Out-of-Band (OAST)**.

**Using Burp Collaborator:**

1. Generate Collaborator domain
2. Insert it into SSRF payload
3. Poll Collaborator for interactions

Even **DNS only** interaction proves SSRF because:

- network often blocks HTTP but allows DNS 🧠

### Exploiting Blind SSRF 💣

Blind SSRF can be used to:

**A. Scan internal networks 🕵️**

Use SSRF to send payloads to internal IPs and watch for Collaborator hits.

**B. Attack the HTTP client 🧨**

If the server’s HTTP client is vulnerable, you can send malicious responses to cause:

- RCE
- server crashes
- unexpected behavior

---

## SSRF Hidden Sources (Harder to Find) 🔍

### Partial URL Inputs 🧩

Sometimes the application only accepts:

- hostname
- partial path

Example:

```text
hostname = example.com
```

The server builds:

```text
http://example.com/api
```

This makes SSRF harder because you don’t control the full URL.

### SSRF via Referer Header 🧾

Some apps use server-side analytics to:

- read Referer header
- fetch the URL for analysis

If you control the Referer, you can trigger SSRF.

Example:

```text
Referer: http://evil.com
```

---

## Final Notes 🧠

SSRF vulnerabilities are extremely powerful because they bypass network security and access internal systems.

### Always check:

- direct URL parameters
- partial URL inputs
- headers like Referer
- open redirect features
- internal URL building logic

**Part 4 taught me:**

> SSRF is not just a vulnerability — it’s a gateway to internal systems and network-level trust bypass.

**The labs showed:**

- how SSRF works
- how filters fail
- how blind SSRF is detected
- how to exploit internal systems using redirects and collaborator payloads

![PortSwigger Web Security Academy – Server-side request forgery (SSRF) attacks 23 of 23](../public/images/web-hack-part-4/img_00.png)

![Burp Suite Professional – Blind SSRF with out-of-band detection](../public/images/web-hack-part-4/img_01.png)
