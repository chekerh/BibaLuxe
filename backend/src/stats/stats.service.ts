import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getDashboardStats() {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      this.orderModel.countDocuments(),
      this.productModel.countDocuments(),
      this.userModel.countDocuments(),
      this.getTotalRevenue(),
      this.getRecentOrders(5),
      this.getLowStockProducts(),
    ]);

    const pendingOrders = await this.orderModel.countDocuments({ status: 'pending' });
    const paidOrders = await this.orderModel.countDocuments({ paymentStatus: 'paid' });

    return {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      pendingOrders,
      paidOrders,
      recentOrders,
      lowStockProducts: lowStockProducts.length,
    };
  }

  async getSalesData(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.orderModel
      .find({
        createdAt: { $gte: startDate },
        paymentStatus: 'paid',
      })
      .sort({ createdAt: 1 })
      .exec();

    // Group by date
    const salesByDate: Record<string, { date: string; revenue: number; orders: number }> = {};

    orders.forEach((order) => {
      // Access createdAt from the document (timestamps are added by Mongoose)
      const createdAt = (order as any).createdAt || new Date();
      const date = new Date(createdAt).toISOString().split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = { date, revenue: 0, orders: 0 };
      }
      salesByDate[date].revenue += order.total;
      salesByDate[date].orders += 1;
    });

    // Fill in missing dates with zero values
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      result.push(
        salesByDate[dateStr] || { date: dateStr, revenue: 0, orders: 0 },
      );
    }

    return result;
  }

  private async getTotalRevenue(): Promise<number> {
    const result = await this.orderModel.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  private async getRecentOrders(limit: number = 5) {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  private async getLowStockProducts() {
    // For now, return products that are out of stock
    // In a real app, you'd check actual stock levels
    return this.productModel.find({ inStock: false }).exec();
  }
}
