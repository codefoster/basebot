let customers = [
    { customerId: 1, type: 'tech', name: 'Loretta Rayes', phone: '(345) 501-2527', onCall: true, pendingAppt: false },
    { customerId: 2, type: 'tech', name: 'Gary Foster', phone: '(662) 588-7043', onCall: false },
    { customerId: 3, type: 'customer', name: 'Kenneth Coleman', phone: '(510) 266-3583', pendingAppt: false },
    {
        customerId: 4, type: 'customer', name: 'Tim Hiatt', phone: '(497) 889-1015', pendingAppt: true,
        orders: [
            { orderId: 1, date: '1/31/2016' },
            { orderId: 2, date: '2/14/2017' },
            { orderId: 3, date: '2/23/2017' }
        ]
    }
];

module.exports.customers = customers;

module.exports.findCustomer = function (customerId) {
    return customers.filter(x => x.customerId == customerId);
}