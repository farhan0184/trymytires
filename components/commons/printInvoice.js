import dayjs from "dayjs";

export const printInvoice = async (selectedInvoice, currency = "$") => {

    if (!selectedInvoice) {
        alert("No invoice to print.");
        return;
    }

    const toBase64 = async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

    const logoBase64 = await toBase64(`${window.location.origin}/logo_b.png`);

    const rowsHtml = selectedInvoice?.products?.map((product, idx) => {
        const totalPrice = (product?.discount_price * product?.quantity).toFixed(2);
        return `
            <tr class="item">
                <td>${idx + 1}</td>
                <td>
                    <strong>${product?.name}</strong><br/>
                    <small>${product?.description?.en.slice(0,60) || ""}...</small>
                </td>
                <td class="textAlign">${product?.quantity}</td>
                <td class="textAlign">${currency}${product?.price.toFixed(2)}</td>
                <td class="textAlign">${currency}${product?.discount_price.toFixed(2)}</td>
                <td class="textAlign">${currency}${totalPrice}</td>
            </tr>
        `;
    }).join('');

    const discount = (selectedInvoice?.total_price - selectedInvoice?.amount).toFixed(2);

    const html = `
        <html>
        <head>
            <title>Invoice - ${selectedInvoice?.invoice_id}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    color: #333; 
                    line-height: 1.4;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                
                /* Print-specific rules */
                @media print {
                    @page {
                        margin: 0.5in;
                        size: A4;
                    }
                    
                    body {
                        margin: 0;
                        padding: 0;
                        font-size: 12px;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    /* Prevent page breaks */
                    .no-break {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    
                    /* Table page break control */
                    table {
                        page-break-inside: auto;
                        flex-shrink: 0;
                    }
                    
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    
                    thead {
                        display: table-header-group;
                    }
                    
                    tfoot {
                        display: table-footer-group;
                        page-break-inside: avoid;
                    }
                    
                    /* Keep header together */
                    .header {
                        page-break-after: avoid;
                        flex-shrink: 0;
                    }
                    
                    /* Keep info section together */
                    .info {
                        page-break-inside: avoid;
                        page-break-after: avoid;
                        flex-shrink: 0;
                    }
                    
                    /* Force bottom section to stay at bottom */
                    .bottom-section {
                        page-break-inside: avoid;
                        margin-top: auto;
                        flex-shrink: 0;
                    }
                    
                    /* Ensure terms stay together */
                    .terms {
                        page-break-inside: avoid;
                    }
                }

                .content { 
                    width: 100%;
                    max-width: 100%;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    border-bottom: 2px solid #ddd; 
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                
                .header img { 
                    height: 50px; 
                    object-fit: contain; 
                }
                
                .header h2 { 
                    margin: 0; 
                    font-size: 24px; 
                    color: #333;
                }
                
                .info { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 25px; 
                    font-size: 14px;
                    gap: 20px;
                }
                
                .info > div {
                    flex: 1;
                }
                
                .info p {
                    margin: 5px 0;
                    line-height: 1.5;
                }
                
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0; 
                    font-size: 13px;
                    border: 1px solid #ddd;
                    flex-shrink: 0;
                }
                
                th, td { 
                    border: 1px solid #ccc; 
                    padding: 8px 6px;
                    vertical-align: top;
                }
                
                th { 
                    background: #f8f9fa; 
                    font-weight: bold;
                    text-align: center;
                }
                
                .textAlign { 
                    text-align: right; 
                }
                
                tfoot td { 
                    font-weight: bold; 
                    background: #f8f9fa;
                }
                
                .bottom-section { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: flex-start;
                    border-top: 2px solid #ddd; 
                    padding-top: 20px;
                    margin-top: auto;
                    gap: 20px;
                    flex-shrink: 0;
                }
                
                .terms { 
                    font-size: 12px; 
                    max-width: 65%; 
                    flex: 2;
                }
                
                .terms p { 
                    margin: 4px 0; 
                    line-height: 1.4;
                }
                
                .terms strong {
                    font-size: 13px;
                }
                
                .thankyou { 
                    text-align: center;
                    flex: 1;
                    min-width: 120px;
                }
                
                .thankyou img { 
                    width: 80px; 
                    height: auto; 
                    display: block; 
                    margin: 0 auto 10px; 
                }
                
                .thankyou h3 { 
                    margin: 5px 0; 
                    font-size: 16px; 
                    color: #333;
                }
                
                .thankyou p { 
                    margin: 0; 
                    font-size: 12px; 
                    color: #666;
                }

                /* Responsive adjustments */
                @media screen and (max-width: 768px) {
                    .header {
                        flex-direction: column;
                        text-align: center;
                        gap: 10px;
                    }
                    
                    .info {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .bottom-section {
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .terms {
                        max-width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="content">
                <div class="header no-break">
                    <div><img src="${logoBase64}" alt="logo" /></div>
                    <div><h2>INVOICE</h2></div>
                    <div>
                        <p><strong>Invoice No:</strong> ${selectedInvoice?.invoice_id}</p>
                    </div>
                </div>

                <div class="info no-break">
                    <div>
                        <p><strong>Sold to:</strong> ${selectedInvoice?.name}</p>
                        <p><strong>Phone No:</strong> ${selectedInvoice?.phone}</p>
                        <p><strong>Email:</strong> ${selectedInvoice?.email}</p>
                        <p><strong>Address:</strong> ${selectedInvoice?.address}</p>
                    </div>
                    <div>
                        <p><strong>Order No:</strong> ${selectedInvoice?.order_id}</p>
                        <p><strong>Order Date:</strong> ${dayjs(selectedInvoice?.order_date).format("MMMM D, YYYY")}</p>
                        <p><strong>Invoice Date:</strong> ${dayjs(selectedInvoice?.createdAt).format("MMMM D, YYYY")}</p>
                        <p><strong>Payment Terms:</strong> ${selectedInvoice.paymentTerms}</p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%">#</th>
                            <th style="width: 40%">Product</th>
                            <th style="width: 10%" class="textAlign">QTY</th>
                            <th style="width: 15%" class="textAlign">Price</th>
                            <th style="width: 15%" class="textAlign">Discount Price</th>
                            <th style="width: 15%" class="textAlign">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5" class="textAlign">Discount:</td>
                            <td class="textAlign">${currency}${discount}</td>
                        </tr>
                        <tr>
                            <td colspan="5" class="textAlign"><strong>Total:</strong></td>
                            <td class="textAlign"><strong>${currency}${selectedInvoice?.amount.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>

                <div class="bottom-section no-break">
                    <div class="terms">
                        <p><strong>Terms and Policy:</strong></p>
                        <p>1. Please review the following important details.</p>
                        <p>2. Our satisfaction guarantee ensures high standards are met for all products.</p>
                        <p>3. Returns are accepted on unused items within 7 - 14 days of delivery.</p>
                        <p>4. Please repair damages on site before acceptance.</p>
                        <p>5. Goods will be delivered within 2-3 working days from confirmation of order.</p>
                        <p>6. For support, contact us through our website or customer service email.</p>
                    </div>
                    <div class="thankyou">
                        <img src="${logoBase64}" alt="logo" />
                        <h3>Thank You!</h3>
                        <p>For being with us</p>
                    </div>
                </div>
            </div>

            <script>
                window.onload = function() {
                    // Small delay to ensure styles are applied
                    setTimeout(() => {
                        window.print();
                        window.onafterprint = function() { 
                            window.close(); 
                        };
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;


        const printWindow = window.open('', '', 'width=900,height=700,scrollbars=yes');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
        } else {
            alert('Please allow popups for this website to print the invoice.');
        }
     
};




export const generateInvoiceHtml = async (selectedInvoice, currency = "$") => {
  if (!selectedInvoice) {
    alert("No invoice to generate.");
    return "";
  }

  // ✅ Works in browser
  const toBase64 = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  // load logo from /public
  const logoBase64 = await toBase64(`${window.location.origin}/logo_b.png`);

  const rowsHtml = selectedInvoice?.products
    ?.map((product, idx) => {
      const totalPrice = (product?.discount_price * product?.quantity).toFixed(2);
      return `
        <tr>
            <td>${idx + 1}</td>
            <td>
                <strong>${product?.name}</strong><br/>
                <small>${product?.description?.en || ""}</small>
            </td>
            <td style="text-align:right">${product?.quantity}</td>
            <td style="text-align:right">${currency}${product?.price.toFixed(2)}</td>
            <td style="text-align:right">${currency}${product?.discount_price.toFixed(2)}</td>
            <td style="text-align:right">${currency}${totalPrice}</td>
        </tr>
      `;
    })
    .join("");

  const discount = (
    selectedInvoice?.total_price - selectedInvoice?.amount
  ).toFixed(2);

  return `
    <div style="font-family: Arial, sans-serif; color:#333; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #ddd; padding-bottom:15px; margin-bottom:20px;">
            <img src="${logoBase64}" alt="logo" style="height:50px;"/>
            <h2 style="margin:0;">INVOICE</h2>
            <p><strong>Invoice No:</strong> ${selectedInvoice?.invoice_id}</p>
        </div>

        <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:14px;">
            <div>
                <p><strong>Sold to:</strong> ${selectedInvoice?.name}</p>
                <p><strong>Phone No:</strong> ${selectedInvoice?.phone}</p>
                <p><strong>Email:</strong> ${selectedInvoice?.email}</p>
                <p><strong>Address:</strong> ${selectedInvoice?.address}</p>
            </div>
            <div>
                <p><strong>Order No:</strong> ${selectedInvoice?.order_id}</p>
                <p><strong>Order Date:</strong> ${dayjs(selectedInvoice?.order_date).format("MMMM D, YYYY")}</p>
                <p><strong>Invoice Date:</strong> ${dayjs(selectedInvoice?.createdAt).format("MMMM D, YYYY")}</p>
                <p><strong>Payment Terms:</strong> ${selectedInvoice.paymentTerms}</p>
            </div>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:13px; border:1px solid #ddd; margin-bottom:20px;">
            <thead>
                <tr style="background:#f8f9fa;">
                    <th style="border:1px solid #ccc; padding:8px;">#</th>
                    <th style="border:1px solid #ccc; padding:8px;">Product</th>
                    <th style="border:1px solid #ccc; padding:8px;">QTY</th>
                    <th style="border:1px solid #ccc; padding:8px;">Price</th>
                    <th style="border:1px solid #ccc; padding:8px;">Discount Price</th>
                    <th style="border:1px solid #ccc; padding:8px;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" style="text-align:right; font-weight:bold; border:1px solid #ccc;">Discount:</td>
                    <td style="text-align:right; border:1px solid #ccc;">${currency}${discount}</td>
                </tr>
                <tr>
                    <td colspan="5" style="text-align:right; font-weight:bold; border:1px solid #ccc;">Total:</td>
                    <td style="text-align:right; border:1px solid #ccc;"><strong>${currency}${selectedInvoice?.amount.toFixed(2)}</strong></td>
                </tr>
            </tfoot>
        </table>

        <div style="border-top:2px solid #ddd; padding-top:20px; display:flex; justify-content:space-between; font-size:12px;">
            <div style="max-width:65%;">
                <p><strong>Terms and Policy:</strong></p>
                <p>1. Please review the following important details.</p>
                <p>2. Our satisfaction guarantee ensures high standards are met for all products.</p>
                <p>3. Returns are accepted on unused items within 7 - 14 days of delivery.</p>
                <p>4. Please repair damages on site before acceptance.</p>
                <p>5. Goods will be delivered within 2-3 working days from confirmation of order.</p>
                <p>6. For support, contact us through our website or customer service email.</p>
            </div>
            <div style="text-align:center;">
                <img src="${logoBase64}" style="width:80px; margin-bottom:10px;" />
                <h3 style="margin:5px 0;">Thank You!</h3>
                <p style="margin:0;">For being with us</p>
            </div>
        </div>
    </div>
  `;
};
